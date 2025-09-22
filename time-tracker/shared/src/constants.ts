// Application Configuration
export const APP_CONFIG = {
  NAME: 'Guardian Time Tracker',
  VERSION: '1.0.0',
  COMPANY: 'Guardian Dental Billing LLC',
  DESCRIPTION: 'Employee time tracking with screenshot monitoring',
} as const;

// Screenshot Configuration
export const SCREENSHOT_CONFIG = {
  INTERVAL_MINUTES: 10,
  SCREENSHOTS_PER_INTERVAL: 2,
  SCREENSHOTS_PER_HOUR: 12,
  MAX_FILE_SIZE_MB: 5,
  SUPPORTED_FORMATS: ['png', 'jpg', 'jpeg'] as const,
  QUALITY: 80,
  THUMBNAIL_SIZE: { width: 200, height: 150 },
} as const;

// Time Tracking Configuration
export const TIME_CONFIG = {
  MIN_TRACK_DURATION_SECONDS: 60,
  AUTO_PAUSE_IDLE_MINUTES: 15,
  MAX_DAILY_HOURS: 16,
  BREAK_REMINDER_INTERVAL_MINUTES: 120,
} as const;

// Security Configuration
export const SECURITY_CONFIG = {
  JWT_EXPIRES_IN: '8h',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  PASSWORD_MIN_LENGTH: 8,
  SESSION_TIMEOUT_MINUTES: 480, // 8 hours
} as const;

// API Configuration
export const API_CONFIG = {
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MINUTES: 15,
  MAX_FILE_UPLOAD_SIZE_MB: 10,
  SCREENSHOT_UPLOAD_BATCH_SIZE: 5,
  HEARTBEAT_INTERVAL_SECONDS: 30,
} as const;

// Database Configuration
export const DB_CONFIG = {
  CONNECTION_TIMEOUT_MS: 10000,
  QUERY_TIMEOUT_MS: 30000,
  MAX_CONNECTIONS: 10,
  MIN_CONNECTIONS: 2,
} as const;

// File Storage Configuration
export const STORAGE_CONFIG = {
  SCREENSHOTS_DIR: 'screenshots',
  THUMBNAILS_DIR: 'thumbnails',
  LOGS_DIR: 'logs',
  TEMP_DIR: 'temp',
  ENCRYPTION_ALGORITHM: 'aes-256-gcm',
  BACKUP_RETENTION_DAYS: 90,
} as const;

// Activity Tracking Configuration
export const ACTIVITY_CONFIG = {
  MOUSE_TRACKING_INTERVAL_MS: 1000,
  KEYBOARD_TRACKING_INTERVAL_MS: 1000,
  ACTIVITY_SCORE_THRESHOLD: 30,
  IDLE_THRESHOLD_MINUTES: 5,
  WINDOW_TRACKING_ENABLED: true,
} as const;

// UI Configuration
export const UI_CONFIG = {
  THEME: {
    PRIMARY: '#2563eb',
    SECONDARY: '#64748b',
    SUCCESS: '#059669',
    WARNING: '#d97706',
    ERROR: '#dc2626',
    INFO: '#0891b2',
  },
  NOTIFICATIONS: {
    DURATION_MS: 5000,
    MAX_VISIBLE: 3,
    POSITION: 'top-right' as const,
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
  },
} as const;

// System Tray Configuration
export const SYSTEM_TRAY_CONFIG = {
  ICON_SIZE: 16,
  NOTIFICATION_DURATION_MS: 3000,
  SCREENSHOT_NOTIFICATION_ENABLED: true,
  BREAK_REMINDER_ENABLED: true,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Session has expired, please login again',
    TOKEN_INVALID: 'Invalid authentication token',
    ACCESS_DENIED: 'Access denied',
    ACCOUNT_LOCKED: 'Account has been locked due to too many failed attempts',
  },
  VALIDATION: {
    REQUIRED_FIELD: 'This field is required',
    INVALID_EMAIL: 'Please enter a valid email address',
    PASSWORD_TOO_SHORT: 'Password must be at least 8 characters long',
    INVALID_TIME_ENTRY: 'Invalid time entry data',
    FILE_TOO_LARGE: 'File size exceeds maximum allowed limit',
  },
  SYSTEM: {
    SERVER_ERROR: 'An internal server error occurred',
    DATABASE_ERROR: 'Database connection failed',
    FILE_UPLOAD_ERROR: 'Failed to upload file',
    SCREENSHOT_CAPTURE_ERROR: 'Failed to capture screenshot',
    NETWORK_ERROR: 'Network connection error',
  },
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in',
  LOGOUT: 'Successfully logged out',
  TIME_STARTED: 'Time tracking started',
  TIME_STOPPED: 'Time tracking stopped',
  TIME_PAUSED: 'Time tracking paused',
  SCREENSHOT_CAPTURED: 'Screenshot captured successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  PASSWORD_CHANGED: 'Password changed successfully',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  CONNECTION: 'connection',
  DISCONNECT: 'disconnect',
  TIME_ENTRY_START: 'time_entry_start',
  TIME_ENTRY_STOP: 'time_entry_stop',
  TIME_ENTRY_PAUSE: 'time_entry_pause',
  SCREENSHOT_CAPTURED: 'screenshot_captured',
  USER_ACTIVITY: 'user_activity',
  HEARTBEAT: 'heartbeat',
  ERROR: 'error',
} as const;

// File Extensions
export const FILE_EXTENSIONS = {
  IMAGES: ['.png', '.jpg', '.jpeg', '.webp'],
  DOCUMENTS: ['.pdf', '.doc', '.docx', '.txt'],
  VIDEOS: ['.mp4', '.avi', '.mov', '.mkv'],
  AUDIO: ['.mp3', '.wav', '.ogg', '.m4a'],
} as const;

// Environment Variables
export const ENV_VARS = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  DATABASE_URL: process.env.DATABASE_URL || '',
  JWT_SECRET: process.env.JWT_SECRET || '',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
} as const;