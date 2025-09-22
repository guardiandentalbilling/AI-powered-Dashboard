// Example usage files for different scenarios

// 1. Simple Dashboard Integration
import React from 'react';
import { QuickTimeTracker } from './TimeTrackerButton';

export const SimpleDashboard = () => {
  const currentUser = {
    id: 'emp_001',
    email: 'john.doe@company.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Employee Portal</h1>
        <div className="header-actions">
          <QuickTimeTracker user={currentUser} />
        </div>
      </header>
      
      <main className="dashboard-content">
        {/* Your existing dashboard content */}
        <div className="dashboard-cards">
          <div className="card">
            <h3>My Tasks</h3>
            {/* Task list */}
          </div>
          <div className="card">
            <h3>Recent Activity</h3>
            {/* Activity feed */}
          </div>
        </div>
      </main>
    </div>
  );
};

// 2. Navigation Bar Integration
import React from 'react';
import TimeTrackerButton from './TimeTrackerButton';

export const NavigationBar = ({ user, isLoggedIn }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Your Company</h2>
      </div>
      
      <div className="navbar-menu">
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>
        <a href="/reports">Reports</a>
        
        {isLoggedIn && (
          <TimeTrackerButton
            user={user}
            variant="outline"
            size="medium"
            displayMode="modal"
            className="nav-time-tracker"
          />
        )}
      </div>
    </nav>
  );
};

// 3. Widget/Card Integration
import React, { useState } from 'react';
import TimeTrackerButton from './TimeTrackerButton';

export const TimeTrackingWidget = ({ user }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);

  const handleTimeTrackingChange = (tracking, timeEntry) => {
    setIsTracking(tracking);
    setCurrentSession(timeEntry);
    
    // You can integrate with your existing state management
    // dispatch({ type: 'SET_TIME_TRACKING', payload: { tracking, timeEntry } });
  };

  return (
    <div className="time-tracking-widget">
      <div className="widget-header">
        <h3>⏱️ Time Tracking</h3>
        <div className={`status-badge ${isTracking ? 'active' : 'inactive'}`}>
          {isTracking ? 'Active' : 'Inactive'}
        </div>
      </div>
      
      <div className="widget-content">
        {isTracking && currentSession ? (
          <div className="active-session">
            <p>Currently tracking:</p>
            <p><strong>{currentSession.description || 'Work session'}</strong></p>
            <p>Started: {new Date(currentSession.startTime).toLocaleTimeString()}</p>
          </div>
        ) : (
          <p>No active time tracking session</p>
        )}
        
        <TimeTrackerButton
          user={user}
          variant="primary"
          size="large"
          displayMode="modal"
          onTimeTrackingChange={handleTimeTrackingChange}
          className="widget-button"
        />
      </div>
    </div>
  );
};

// 4. Sidebar Integration
import React from 'react';
import { FloatingTimeTracker } from './TimeTrackerButton';

export const AppLayout = ({ children, user }) => {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Menu</h3>
        </div>
        
        <ul className="sidebar-menu">
          <li><a href="/dashboard">📊 Dashboard</a></li>
          <li><a href="/projects">📁 Projects</a></li>
          <li><a href="/team">👥 Team</a></li>
          <li><a href="/settings">⚙️ Settings</a></li>
        </ul>
        
        <div className="sidebar-footer">
          <TimeTrackerButton
            user={user}
            variant="minimal"
            size="small"
            displayMode="newTab"
            className="sidebar-time-tracker"
          />
        </div>
      </aside>
      
      <main className="main-content">
        {children}
      </main>
      
      {/* Alternative: Floating button */}
      <FloatingTimeTracker 
        position="bottom-right"
        user={user}
      />
    </div>
  );
};

// 5. Table/List Integration (for admin views)
import React from 'react';
import TimeTrackerButton from './TimeTrackerButton';

export const EmployeeList = ({ employees }) => {
  return (
    <div className="employee-list">
      <h2>Employee Time Tracking</h2>
      
      <table className="employees-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.firstName} {employee.lastName}</td>
              <td>{employee.email}</td>
              <td>
                <span className={`status ${employee.isTracking ? 'tracking' : 'idle'}`}>
                  {employee.isTracking ? '🟢 Tracking' : '⚫ Idle'}
                </span>
              </td>
              <td>
                <TimeTrackerButton
                  user={employee}
                  variant="outline"
                  size="small"
                  displayMode="modal"
                  timeTrackerUrl="http://localhost:3000"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// 6. Custom Hook for Time Tracking State
import { useState, useEffect } from 'react';

export const useTimeTracking = (userId) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [totalToday, setTotalToday] = useState(0);

  // This would connect to your actual API when ready
  useEffect(() => {
    // Fetch current tracking status
    // fetchTrackingStatus(userId);
  }, [userId]);

  const handleTrackingChange = (tracking, timeEntry) => {
    setIsTracking(tracking);
    setCurrentSession(timeEntry);
    
    // Update your global state, localStorage, etc.
    localStorage.setItem('timeTracking', JSON.stringify({
      isTracking: tracking,
      session: timeEntry,
      timestamp: Date.now()
    }));
  };

  return {
    isTracking,
    currentSession,
    totalToday,
    handleTrackingChange
  };
};

// Usage of custom hook
export const DashboardWithTimeTracking = ({ user }) => {
  const { isTracking, currentSession, handleTrackingChange } = useTimeTracking(user.id);

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Time Today</h3>
          <p>{isTracking ? 'Currently tracking' : 'Not tracking'}</p>
        </div>
      </div>
      
      <TimeTrackerButton
        user={user}
        onTimeTrackingChange={handleTrackingChange}
      />
    </div>
  );
};