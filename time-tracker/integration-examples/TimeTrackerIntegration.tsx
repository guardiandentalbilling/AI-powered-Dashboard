import React, { useState, useEffect, useCallback } from 'react';
import GuardianTimeTrackerClient, { TimeEntry, User, Project } from './guardian-api-client';

interface TimeTrackerIntegrationProps {
  apiUrl?: string;
  wsUrl?: string;
  userId?: string;
  className?: string;
  onTimeEntryChange?: (timeEntry: TimeEntry | null) => void;
  showProjectSelector?: boolean;
  showDescription?: boolean;
}

export const TimeTrackerIntegration: React.FC<TimeTrackerIntegrationProps> = ({
  apiUrl = 'http://localhost:3001',
  wsUrl = 'ws://localhost:3001',
  userId,
  className = '',
  onTimeEntryChange,
  showProjectSelector = true,
  showDescription = true,
}) => {
  const [client] = useState(() => new GuardianTimeTrackerClient({ apiUrl, wsUrl }));
  const [activeTimeEntry, setActiveTimeEntry] = useState<TimeEntry | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Load stored authentication token
  useEffect(() => {
    client.loadStoredToken();
  }, [client]);

  // Fetch initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Timer for elapsed time
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (activeTimeEntry?.status === 'active') {
      interval = setInterval(() => {
        const start = new Date(activeTimeEntry.startTime).getTime();
        const now = Date.now();
        setElapsedTime(Math.floor((now - start) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimeEntry]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    client.connectWebSocket((event) => {
      switch (event.type) {
        case 'TIME_ENTRY_STARTED':
        case 'TIME_ENTRY_STOPPED':
        case 'TIME_ENTRY_PAUSED':
        case 'TIME_ENTRY_RESUMED':
          if (!userId || event.payload.userId === userId) {
            setActiveTimeEntry(event.payload);
            if (onTimeEntryChange) {
              onTimeEntryChange(event.payload);
            }
          }
          break;
      }
    });

    return () => {
      client.disconnectWebSocket();
    };
  }, [client, userId, onTimeEntryChange]);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      
      // Load active time entry
      const activeEntry = await client.getActiveTimeEntry(userId);
      if (activeEntry.success && activeEntry.data) {
        setActiveTimeEntry(activeEntry.data);
        if (onTimeEntryChange) {
          onTimeEntryChange(activeEntry.data);
        }
      }

      // Load projects if needed
      if (showProjectSelector) {
        const projectsResponse = await client.getProjects();
        if (projectsResponse.success) {
          setProjects(projectsResponse.data || []);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await client.startTimeTracking(
        selectedProject || undefined,
        description || undefined
      );

      if (response.success) {
        setActiveTimeEntry(response.data);
        if (onTimeEntryChange) {
          onTimeEntryChange(response.data);
        }
      } else {
        setError(response.message || 'Failed to start tracking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const stopTracking = async () => {
    if (!activeTimeEntry) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await client.stopTimeTracking(activeTimeEntry.id);

      if (response.success) {
        setActiveTimeEntry(null);
        setElapsedTime(0);
        if (onTimeEntryChange) {
          onTimeEntryChange(null);
        }
      } else {
        setError(response.message || 'Failed to stop tracking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to stop tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const pauseTracking = async () => {
    if (!activeTimeEntry) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await client.pauseTimeTracking(activeTimeEntry.id);

      if (response.success) {
        setActiveTimeEntry(response.data);
        if (onTimeEntryChange) {
          onTimeEntryChange(response.data);
        }
      } else {
        setError(response.message || 'Failed to pause tracking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pause tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const resumeTracking = async () => {
    if (!activeTimeEntry) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await client.resumeTimeTracking(activeTimeEntry.id);

      if (response.success) {
        setActiveTimeEntry(response.data);
        if (onTimeEntryChange) {
          onTimeEntryChange(response.data);
        }
      } else {
        setError(response.message || 'Failed to resume tracking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume tracking');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTracking = activeTimeEntry?.status === 'active';
  const isPaused = activeTimeEntry?.status === 'paused';

  return (
    <div className={`guardian-time-tracker ${className}`}>
      <div className="tracker-header">
        <h3>Time Tracker</h3>
        {activeTimeEntry && (
          <div className="timer-display">
            <span className={`timer ${isTracking ? 'active' : isPaused ? 'paused' : 'stopped'}`}>
              {formatTime(elapsedTime)}
            </span>
            <span className={`status-indicator ${activeTimeEntry.status}`}>
              {activeTimeEntry.status}
            </span>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!activeTimeEntry ? (
        // Start tracking form
        <div className="start-form">
          {showProjectSelector && (
            <div className="field">
              <label>Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                disabled={isLoading}
              >
                <option value="">No Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {showDescription && (
            <div className="field">
              <label>Description:</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you working on?"
                disabled={isLoading}
              />
            </div>
          )}

          <button
            onClick={startTracking}
            disabled={isLoading}
            className="start-button"
          >
            {isLoading ? 'Starting...' : 'Start Tracking'}
          </button>
        </div>
      ) : (
        // Active tracking controls
        <div className="tracking-controls">
          <div className="tracking-info">
            {activeTimeEntry.projectId && (
              <div className="project-name">
                Project: {projects.find(p => p.id === activeTimeEntry.projectId)?.name || 'Unknown'}
              </div>
            )}
            {activeTimeEntry.description && (
              <div className="description">
                {activeTimeEntry.description}
              </div>
            )}
          </div>

          <div className="control-buttons">
            {isTracking ? (
              <button
                onClick={pauseTracking}
                disabled={isLoading}
                className="pause-button"
              >
                {isLoading ? 'Pausing...' : 'Pause'}
              </button>
            ) : isPaused ? (
              <button
                onClick={resumeTracking}
                disabled={isLoading}
                className="resume-button"
              >
                {isLoading ? 'Resuming...' : 'Resume'}
              </button>
            ) : null}

            <button
              onClick={stopTracking}
              disabled={isLoading}
              className="stop-button"
            >
              {isLoading ? 'Stopping...' : 'Stop'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTrackerIntegration;