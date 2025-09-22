import React, { useState, useEffect } from 'react';
import './TimeTrackerButton.css';

interface TimeTrackerButtonProps {
  /**
   * URL to the Guardian Time Tracker application
   * Default: http://localhost:3000 (adjust based on your setup)
   */
  timeTrackerUrl?: string;
  
  /**
   * Current user information to pass to the time tracker
   */
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Button style variant
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal';
  
  /**
   * Button size
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Whether to show the time tracker in a modal/popup or new tab
   */
  displayMode?: 'modal' | 'newTab' | 'iframe';
  
  /**
   * Callback when time tracking starts/stops
   */
  onTimeTrackingChange?: (isTracking: boolean, timeEntry?: any) => void;
}

export const TimeTrackerButton: React.FC<TimeTrackerButtonProps> = ({
  timeTrackerUrl = 'http://localhost:3000',
  user,
  className = '',
  variant = 'primary',
  size = 'medium',
  displayMode = 'newTab',
  onTimeTrackingChange
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');

  // Simulate time tracking status (replace with real API calls)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const hours = Math.floor(elapsed / 3600);
        const minutes = Math.floor((elapsed % 3600) / 60);
        const seconds = elapsed % 60;
        setCurrentTime(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const handleTimeTrackerClick = () => {
    if (displayMode === 'newTab') {
      // Open in new tab with user data
      const params = user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : '';
      window.open(`${timeTrackerUrl}${params}`, '_blank');
    } else if (displayMode === 'modal') {
      setShowModal(true);
    }
  };

  const handleStartTracking = () => {
    setIsTracking(true);
    if (onTimeTrackingChange) {
      onTimeTrackingChange(true, {
        id: Date.now().toString(),
        startTime: new Date(),
        status: 'active'
      });
    }
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    setCurrentTime('00:00:00');
    if (onTimeTrackingChange) {
      onTimeTrackingChange(false);
    }
  };

  const buttonClasses = `
    time-tracker-button 
    time-tracker-button--${variant} 
    time-tracker-button--${size} 
    ${isTracking ? 'time-tracker-button--active' : ''}
    ${className}
  `.trim();

  return (
    <>
      <div className="time-tracker-widget">
        {/* Main Time Tracker Button */}
        <button 
          className={buttonClasses}
          onClick={handleTimeTrackerClick}
          title="Open Time Tracker"
        >
          <span className="time-tracker-icon">
            {isTracking ? '⏸️' : '⏱️'}
          </span>
          <span className="time-tracker-text">
            {isTracking ? `Tracking: ${currentTime}` : 'Time Tracker'}
          </span>
        </button>

        {/* Quick Actions (if tracking is active) */}
        {isTracking && (
          <div className="time-tracker-controls">
            <button 
              className="time-tracker-control-btn time-tracker-control-btn--pause"
              onClick={handleStopTracking}
              title="Stop Tracking"
            >
              ⏹️
            </button>
            <button 
              className="time-tracker-control-btn time-tracker-control-btn--open"
              onClick={handleTimeTrackerClick}
              title="Open Full Tracker"
            >
              🔗
            </button>
          </div>
        )}

        {/* Status Indicator */}
        {isTracking && (
          <div className="time-tracker-status">
            <div className="time-tracker-pulse"></div>
            <span>Active</span>
          </div>
        )}
      </div>

      {/* Modal (if displayMode is modal) */}
      {showModal && displayMode === 'modal' && (
        <div className="time-tracker-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="time-tracker-modal" onClick={e => e.stopPropagation()}>
            <div className="time-tracker-modal-header">
              <h3>Guardian Time Tracker</h3>
              <button 
                className="time-tracker-modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="time-tracker-modal-content">
              <iframe
                src={`${timeTrackerUrl}${user ? `?userId=${user.id}&email=${encodeURIComponent(user.email)}` : ''}`}
                width="100%"
                height="600"
                frameBorder="0"
                title="Guardian Time Tracker"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Quick integration component for simple use cases
export const QuickTimeTracker: React.FC<{
  user?: { id: string; email: string; firstName: string; lastName: string };
  onTimeTrackingChange?: (isTracking: boolean) => void;
}> = ({ user, onTimeTrackingChange }) => {
  return (
    <TimeTrackerButton
      user={user}
      variant="primary"
      size="medium"
      displayMode="newTab"
      onTimeTrackingChange={onTimeTrackingChange}
    />
  );
};

// Minimal floating button
export const FloatingTimeTracker: React.FC<{
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  user?: { id: string; email: string; firstName: string; lastName: string };
}> = ({ position = 'bottom-right', user }) => {
  return (
    <div className={`floating-time-tracker floating-time-tracker--${position}`}>
      <TimeTrackerButton
        user={user}
        variant="primary"
        size="large"
        displayMode="modal"
        className="floating-button"
      />
    </div>
  );
};

export default TimeTrackerButton;