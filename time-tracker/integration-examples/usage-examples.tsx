// Example: How to integrate Guardian Time Tracker into your existing web application

import React from 'react';
import TimeTrackerIntegration from './integration-examples/TimeTrackerIntegration';
import './integration-examples/TimeTrackerIntegration.css';

// Example 1: Simple integration in a dashboard
export const EmployeeDashboard: React.FC = () => {
  const handleTimeEntryChange = (timeEntry: any) => {
    console.log('Time entry changed:', timeEntry);
    // Update your app's state, send notifications, etc.
  };

  return (
    <div className="dashboard">
      <h1>Employee Dashboard</h1>
      
      {/* Your existing content */}
      <div className="dashboard-content">
        <div className="left-panel">
          {/* Your existing components */}
          <div className="tasks-widget">
            <h3>My Tasks</h3>
            {/* Task list */}
          </div>
        </div>
        
        <div className="right-panel">
          {/* Guardian Time Tracker Integration */}
          <TimeTrackerIntegration
            apiUrl="http://localhost:3001"
            wsUrl="ws://localhost:3001"
            userId="current-user-id"
            onTimeEntryChange={handleTimeEntryChange}
            showProjectSelector={true}
            showDescription={true}
            className="my-time-tracker"
          />
          
          {/* Your other widgets */}
        </div>
      </div>
    </div>
  );
};

// Example 2: Minimal time tracker widget
export const MinimalTimeTracker: React.FC = () => {
  return (
    <TimeTrackerIntegration
      apiUrl="http://localhost:3001"
      showProjectSelector={false}
      showDescription={false}
      className="minimal-tracker"
    />
  );
};

// Example 3: Admin view with employee time tracking
export const AdminTimeTrackingView: React.FC = () => {
  const [employees] = React.useState([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    // ... your employees
  ]);

  return (
    <div className="admin-view">
      <h1>Employee Time Tracking</h1>
      
      <div className="employee-trackers">
        {employees.map(employee => (
          <div key={employee.id} className="employee-tracker">
            <h4>{employee.name}</h4>
            <TimeTrackerIntegration
              apiUrl="http://localhost:3001"
              userId={employee.id}
              showProjectSelector={true}
              showDescription={false}
              className="admin-employee-tracker"
              onTimeEntryChange={(timeEntry) => {
                console.log(`${employee.name} time entry:`, timeEntry);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// Example 4: Using the API client directly (without React component)
import GuardianTimeTrackerClient from './integration-examples/guardian-api-client';

export class TimeTrackingService {
  private client: GuardianTimeTrackerClient;

  constructor() {
    this.client = new GuardianTimeTrackerClient({
      apiUrl: 'http://localhost:3001',
      wsUrl: 'ws://localhost:3001'
    });
  }

  async initializeTracking(userToken: string) {
    // Set the auth token (if you're handling auth in your app)
    this.client.loadStoredToken();
    
    // Connect to real-time updates
    this.client.connectWebSocket((event) => {
      this.handleWebSocketEvent(event);
    });
  }

  async startUserTimeTracking(projectId?: string, description?: string) {
    try {
      const result = await this.client.startTimeTracking(projectId, description);
      
      if (result.success) {
        // Notify your app that tracking started
        this.notifyTrackingStarted(result.data);
        return result.data;
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Failed to start tracking:', error);
      throw error;
    }
  }

  async getTimeReport(startDate: Date, endDate: Date, userId?: string) {
    return this.client.getTimeReport({
      startDate,
      endDate,
      userId,
      groupBy: 'day'
    });
  }

  async getUserScreenshots(userId: string, dateRange: { startDate: Date; endDate: Date }) {
    return this.client.getScreenshotsByUser(userId, dateRange);
  }

  private handleWebSocketEvent(event: any) {
    switch (event.type) {
      case 'TIME_ENTRY_STARTED':
        // Handle in your app
        this.onTimeTrackingStarted(event.payload);
        break;
      case 'TIME_ENTRY_STOPPED':
        // Handle in your app
        this.onTimeTrackingStopped(event.payload);
        break;
      case 'SCREENSHOT_CAPTURED':
        // Handle in your app
        this.onScreenshotCaptured(event.payload);
        break;
    }
  }

  private notifyTrackingStarted(timeEntry: any) {
    // Integrate with your app's notification system
    console.log('Time tracking started:', timeEntry);
  }

  private onTimeTrackingStarted(timeEntry: any) {
    // Update your app's UI, send notifications, etc.
    console.log('Real-time: Time tracking started:', timeEntry);
  }

  private onTimeTrackingStopped(timeEntry: any) {
    // Update your app's UI
    console.log('Real-time: Time tracking stopped:', timeEntry);
  }

  private onScreenshotCaptured(screenshot: any) {
    // Handle screenshot notifications in your app
    console.log('Real-time: Screenshot captured:', screenshot);
  }
}

// Example 5: Integration with your existing authentication system
export const withGuardianAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const [guardianClient] = React.useState(() => 
      new GuardianTimeTrackerClient({
        apiUrl: 'http://localhost:3001',
        wsUrl: 'ws://localhost:3001'
      })
    );

    React.useEffect(() => {
      // Sync your app's auth with Guardian
      const syncAuthentication = async () => {
        const userToken = localStorage.getItem('your-app-token');
        if (userToken) {
          // You might need to exchange your token for a Guardian token
          // or configure Guardian to accept your tokens
          guardianClient.loadStoredToken();
        }
      };

      syncAuthentication();
    }, [guardianClient]);

    return <WrappedComponent {...props} guardianClient={guardianClient} />;
  };
};

// Usage with HOC
const EnhancedDashboard = withGuardianAuth(EmployeeDashboard);

export default EnhancedDashboard;