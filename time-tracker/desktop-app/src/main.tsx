import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

interface TimeEntry {
  id: string;
  startTime: Date;
  endTime?: Date;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  totalDuration: number;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentTimeEntry, setCurrentTimeEntry] = useState<TimeEntry | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [description, setDescription] = useState('');
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (currentTimeEntry?.status === 'active') {
      interval = setInterval(() => {
        const start = new Date(currentTimeEntry.startTime).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentTimeEntry]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (loginForm.email && loginForm.password) {
        setUser({
          id: '1',
          email: loginForm.email,
          firstName: 'John',
          lastName: 'Doe'
        });
        setIsLoggedIn(true);
        setLoginForm({ email: '', password: '' });
      } else {
        setError('Please enter email and password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (currentTimeEntry?.status === 'active') {
      stopTracking();
    }
    setIsLoggedIn(false);
    setUser(null);
    setCurrentTimeEntry(null);
    setElapsedTime(0);
  };

  const startTracking = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      startTime: new Date(),
      description: description || 'Working on tasks',
      status: 'active',
      totalDuration: 0
    };
    
    setCurrentTimeEntry(newEntry);
    setElapsedTime(0);
    
    // Notify main process
    if (window.electronAPI) {
      window.electronAPI.startTimeTracking(newEntry);
    }
  };

  const pauseTracking = () => {
    if (currentTimeEntry) {
      const updatedEntry = {
        ...currentTimeEntry,
        status: 'paused' as const,
        totalDuration: elapsedTime
      };
      setCurrentTimeEntry(updatedEntry);
      
      if (window.electronAPI) {
        window.electronAPI.pauseTimeTracking(updatedEntry);
      }
    }
  };

  const resumeTracking = () => {
    if (currentTimeEntry) {
      const updatedEntry = {
        ...currentTimeEntry,
        status: 'active' as const,
        startTime: new Date(Date.now() - currentTimeEntry.totalDuration * 1000)
      };
      setCurrentTimeEntry(updatedEntry);
      
      if (window.electronAPI) {
        window.electronAPI.resumeTimeTracking(updatedEntry);
      }
    }
  };

  const stopTracking = () => {
    if (currentTimeEntry) {
      const updatedEntry = {
        ...currentTimeEntry,
        status: 'stopped' as const,
        endTime: new Date(),
        totalDuration: elapsedTime
      };
      
      setCurrentTimeEntry(null);
      setElapsedTime(0);
      setDescription('');
      
      if (window.electronAPI) {
        window.electronAPI.stopTimeTracking(updatedEntry);
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-form">
          <div className="app-header">
            <h1>Guardian Time Tracker</h1>
            <p>Employee Time Tracking & Monitoring</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit" disabled={isLoading} className="login-button">
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          
          <div className="demo-credentials">
            <p><strong>Demo credentials:</strong></p>
            <p>Email: demo@guardian.com</p>
            <p>Password: demo123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="user-info">
          <h2>Welcome, {user?.firstName} {user?.lastName}</h2>
          <p>{user?.email}</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <main className="main-content">
        <div className="time-tracker-section">
          <div className="timer-display">
            <div className="timer-circle">
              <span className={`timer-text ${currentTimeEntry?.status || 'stopped'}`}>
                {formatTime(elapsedTime)}
              </span>
              <div className={`status-indicator ${currentTimeEntry?.status || 'stopped'}`}>
                {currentTimeEntry?.status === 'active' && '● TRACKING'}
                {currentTimeEntry?.status === 'paused' && '⏸ PAUSED'}
                {!currentTimeEntry && '⏹ STOPPED'}
              </div>
            </div>
          </div>

          {!currentTimeEntry ? (
            <div className="start-section">
              <div className="form-group">
                <label htmlFor="description">What are you working on?</label>
                <input
                  id="description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your task..."
                  className="description-input"
                />
              </div>
              
              <button onClick={startTracking} className="start-button">
                <span className="button-icon">▶</span>
                Start Tracking
              </button>
            </div>
          ) : (
            <div className="tracking-section">
              <div className="current-task">
                <h3>Current Task:</h3>
                <p>{currentTimeEntry.description}</p>
                <small>Started: {currentTimeEntry.startTime.toLocaleTimeString()}</small>
              </div>
              
              <div className="control-buttons">
                {currentTimeEntry.status === 'active' ? (
                  <button onClick={pauseTracking} className="pause-button">
                    <span className="button-icon">⏸</span>
                    Pause
                  </button>
                ) : (
                  <button onClick={resumeTracking} className="resume-button">
                    <span className="button-icon">▶</span>
                    Resume
                  </button>
                )}
                
                <button onClick={stopTracking} className="stop-button">
                  <span className="button-icon">⏹</span>
                  Stop
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="screenshot-info">
            <h3>📸 Screenshot Monitoring</h3>
            <p>Screenshots are taken every 5-10 minutes while tracking.</p>
            <p>You'll see a notification when a screenshot is captured.</p>
          </div>
          
          <div className="features-info">
            <h3>✨ Features</h3>
            <ul>
              <li>⏱️ Real-time time tracking</li>
              <li>📷 Automatic screenshots</li>
              <li>🔔 System tray notifications</li>
              <li>📊 Activity monitoring</li>
              <li>🔒 Secure data encryption</li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>Guardian Time Tracker v1.0.0 - Secure Employee Monitoring</p>
      </footer>
    </div>
  );
};

// Add types for Electron API
declare global {
  interface Window {
    electronAPI?: {
      startTimeTracking: (entry: TimeEntry) => void;
      pauseTimeTracking: (entry: TimeEntry) => void;
      resumeTimeTracking: (entry: TimeEntry) => void;
      stopTimeTracking: (entry: TimeEntry) => void;
    };
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
