import { app, BrowserWindow, Tray, Menu, nativeImage, dialog, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import Store from 'electron-store';
import path from 'path';
import Screenshots from 'node-screenshots';
import { machineId } from 'node-machine-id';
import WebSocket from 'ws';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { randomBytes } from 'crypto';

// Types
interface AppConfig {
  apiEndpoint: string;
  screenshotInterval: number;
  screenshotsPerInterval: number;
  enableShutterSound: boolean;
  enableNotifications: boolean;
  autoStart: boolean;
  minimizeToTray: boolean;
}

interface UserSession {
  token: string;
  refreshToken: string;
  user: any;
}

// Initialize store
const store = new Store<{
  config: AppConfig;
  session: UserSession | null;
}>();

// Global variables
let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let ws: WebSocket | null = null;
let screenshotTimer: NodeJS.Timeout | null = null;
let currentTimeEntry: any = null;
let isTracking = false;
let trayMenu: Electron.Menu | null = null;

const isDevelopment = process.env.NODE_ENV === 'development';
const PRELOAD_PATH = path.join(__dirname, 'preload.js');

// Default configuration
const defaultConfig: AppConfig = {
  apiEndpoint: 'http://localhost:3000',
  screenshotInterval: 10, // minutes
  screenshotsPerInterval: 2,
  enableShutterSound: true,
  enableNotifications: true,
  autoStart: false,
  minimizeToTray: true,
};

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false,
    icon: getIconPath(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: PRELOAD_PATH,
      webSecurity: !isDevelopment,
    },
  });

  // Load the app
  if (isDevelopment) {
    mainWindow.loadURL('http://localhost:3003');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../react/index.html'));
  }

  // Window events
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('minimize', (event: Electron.Event) => {
    const config = store.get('config', defaultConfig);
    if (config.minimizeToTray) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  mainWindow.on('close', (event: Electron.Event) => {
    if (isTracking) {
      const choice = dialog.showMessageBoxSync(mainWindow!, {
        type: 'question',
        buttons: ['Cancel', 'Stop Tracking', 'Minimize to Tray'],
        defaultId: 2,
        title: 'Time Tracking Active',
        message: 'You are currently tracking time. What would you like to do?',
      });

      if (choice === 0) {
        event.preventDefault();
        return;
      } else if (choice === 2) {
        event.preventDefault();
        mainWindow?.hide();
        return;
      } else {
        stopTimeTracking();
      }
    }

    app.quit();
  });
}

function createTray(): void {
  const iconPath = getIconPath();
  tray = new Tray(nativeImage.createFromPath(iconPath));

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow?.show();
      },
    },
    {
      label: 'Start Tracking',
      id: 'start-tracking',
      enabled: !isTracking,
      click: () => {
        startTimeTracking();
      },
    },
    {
      label: 'Stop Tracking',
      id: 'stop-tracking',
      enabled: isTracking,
      click: () => {
        stopTimeTracking();
      },
    },
    { type: 'separator' },
    {
      label: 'Settings',
      click: () => {
        mainWindow?.show();
        mainWindow?.webContents.send('navigate-to', '/settings');
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        if (isTracking) {
          stopTimeTracking();
        }
        app.quit();
      },
    },
  ]);

  trayMenu = contextMenu;
  tray.setContextMenu(contextMenu);
  tray.setToolTip('Guardian Time Tracker');

  tray.on('double-click', () => {
    mainWindow?.show();
  });
}

function getIconPath(): string {
  return path.join(__dirname, '../assets/icon.png');
}

async function initializeWebSocket(): Promise<void> {
  const session = store.get('session');
  if (!session?.token) return;

  const config = store.get('config', defaultConfig);
  const wsUrl = config.apiEndpoint.replace('http', 'ws') + '/ws';

  ws = new WebSocket(wsUrl, {
    headers: {
      Authorization: `Bearer ${session.token}`,
    },
  });

  ws.on('open', () => {
    console.log('WebSocket connected');
    mainWindow?.webContents.send('connection-status', { connected: true });
  });

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      mainWindow?.webContents.send('websocket-message', message);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket disconnected');
    mainWindow?.webContents.send('connection-status', { connected: false });
    
    // Reconnect after 5 seconds
    setTimeout(() => {
      initializeWebSocket();
    }, 5000);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
}

async function captureScreenshot(): Promise<string | null> {
  try {
    // For now, create a dummy screenshot file
    // TODO: Implement actual screenshot capture
    const filename = `screenshot_${Date.now()}_${randomBytes(4).toString('hex')}.png`;
    const filePath = path.join(app.getPath('userData'), 'screenshots', filename);
    
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Create a dummy file for now
    fs.writeFileSync(filePath, Buffer.from('dummy screenshot data'));

    // Play shutter sound if enabled
    const config = store.get('config', defaultConfig);
    if (config.enableShutterSound) {
      // TODO: Play shutter sound
    }

    // Show notification if enabled
    if (config.enableNotifications) {
      tray?.displayBalloon({
        title: 'Screenshot Captured',
        content: 'Screenshot captured for time tracking',
        icon: getIconPath(),
      });
    }

    return filePath;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  }
}

async function uploadScreenshot(filePath: string): Promise<void> {
  try {
    const session = store.get('session');
    if (!session?.token || !currentTimeEntry) return;

    const config = store.get('config', defaultConfig);
    const formData = new FormData();
    formData.append('screenshot', fs.createReadStream(filePath));
    formData.append('timeEntryId', currentTimeEntry.id);

    await axios.post(`${config.apiEndpoint}/api/screenshots`, formData, {
      headers: {
        Authorization: `Bearer ${session.token}`,
        ...formData.getHeaders(),
      },
    });

    console.log('Screenshot uploaded successfully');
  } catch (error) {
    console.error('Error uploading screenshot:', error);
  }
}

function scheduleScreenshots(): void {
  if (screenshotTimer) {
    clearInterval(screenshotTimer);
  }

  const config = store.get('config', defaultConfig);
  const intervalMs = config.screenshotInterval * 60 * 1000; // Convert to milliseconds
  const screenshotsPerInterval = config.screenshotsPerInterval;

  screenshotTimer = setInterval(async () => {
    if (!isTracking || !currentTimeEntry) return;

    for (let i = 0; i < screenshotsPerInterval; i++) {
      // Random delay between screenshots
      const delay = Math.random() * (intervalMs / screenshotsPerInterval);
      
      setTimeout(async () => {
        const filePath = await captureScreenshot();
        if (filePath) {
          await uploadScreenshot(filePath);
        }
      }, delay);
    }
  }, intervalMs);
}

async function startTimeTracking(): Promise<void> {
  try {
    const session = store.get('session');
    if (!session?.token) {
      dialog.showErrorBox('Authentication Error', 'Please login first');
      return;
    }

    const config = store.get('config', defaultConfig);
    const deviceId = await machineId();

    const response = await axios.post(
      `${config.apiEndpoint}/api/time-entries`,
      {
        description: 'Desktop tracking session',
        deviceId,
      },
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    currentTimeEntry = response.data.data;
    isTracking = true;

    // Update tray menu
    if (trayMenu) {
      trayMenu.getMenuItemById('start-tracking')!.enabled = false;
      trayMenu.getMenuItemById('stop-tracking')!.enabled = true;
    }

    // Start screenshot scheduling
    scheduleScreenshots();

    // Notify renderer
    mainWindow?.webContents.send('tracking-started', currentTimeEntry);

    console.log('Time tracking started');
  } catch (error) {
    console.error('Error starting time tracking:', error);
    dialog.showErrorBox('Error', 'Failed to start time tracking');
  }
}

async function stopTimeTracking(): Promise<void> {
  try {
    if (!currentTimeEntry || !isTracking) return;

    const session = store.get('session');
    if (!session?.token) return;

    const config = store.get('config', defaultConfig);

    await axios.put(
      `${config.apiEndpoint}/api/time-entries/${currentTimeEntry.id}/stop`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      }
    );

    // Clear screenshot timer
    if (screenshotTimer) {
      clearInterval(screenshotTimer);
      screenshotTimer = null;
    }

    isTracking = false;
    currentTimeEntry = null;

    // Update tray menu
    if (trayMenu) {
      trayMenu.getMenuItemById('start-tracking')!.enabled = true;
      trayMenu.getMenuItemById('stop-tracking')!.enabled = false;
    }

    // Notify renderer
    mainWindow?.webContents.send('tracking-stopped');

    console.log('Time tracking stopped');
  } catch (error) {
    console.error('Error stopping time tracking:', error);
  }
}

// IPC handlers
ipcMain.handle('get-config', () => {
  return store.get('config', defaultConfig);
});

ipcMain.handle('set-config', (_, config: AppConfig) => {
  store.set('config', config);
  return true;
});

ipcMain.handle('get-session', () => {
  return store.get('session');
});

ipcMain.handle('set-session', (_, session: UserSession | null) => {
  store.set('session', session);
  if (session) {
    initializeWebSocket();
  } else if (ws) {
    ws.close();
    ws = null;
  }
  return true;
});

ipcMain.handle('start-tracking', startTimeTracking);
ipcMain.handle('stop-tracking', stopTimeTracking);
ipcMain.handle('is-tracking', () => isTracking);

ipcMain.handle('open-external', (_, url: string) => {
  shell.openExternal(url);
});

// App event handlers
app.whenReady().then(() => {
  createWindow();
  createTray();
  
  // Initialize WebSocket if user is logged in
  const session = store.get('session');
  if (session?.token) {
    initializeWebSocket();
  }

  // Auto-updater setup
  if (!isDevelopment) {
    autoUpdater.checkForUpdatesAndNotify();
  }
});

app.on('window-all-closed', () => {
  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (isTracking) {
    stopTimeTracking();
  }
});

// Auto-updater events
autoUpdater.on('update-available', () => {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version is available. It will be downloaded in the background.',
    buttons: ['OK'],
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Ready',
    message: 'Update downloaded. The application will restart to apply the update.',
    buttons: ['Restart Now', 'Later'],
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});