# Guardian Time Tracker - Web Integration Guide

## 🚀 Integration Methods

### Method 1: NPM Package Installation
```bash
# Install the shared types and utilities
npm install file:../shared

# In your web project
import { TimeEntry, User, ApiResponse } from '@guardian/shared';
```

### Method 2: API Client Setup
```typescript
// api-client.ts
export class GuardianTimeTrackerAPI {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = 'http://localhost:3001/api') {
    this.baseURL = baseURL;
  }

  async login(email: string, password: string) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.token;
    return data;
  }

  async getTimeEntries(userId?: string) {
    return this.request('/time-entries', { userId });
  }

  async getScreenshots(timeEntryId: string) {
    return this.request(`/screenshots/${timeEntryId}`);
  }

  private async request(endpoint: string, params?: any) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.keys(params).forEach(key => 
        url.searchParams.append(key, params[key])
      );
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.json();
  }
}
```

### Method 3: React Component Integration
```tsx
// TimeTrackerWidget.tsx
import React, { useState, useEffect } from 'react';
import { GuardianTimeTrackerAPI } from './api-client';

export const TimeTrackerWidget: React.FC = () => {
  const [timeEntries, setTimeEntries] = useState([]);
  const [isTracking, setIsTracking] = useState(false);
  const api = new GuardianTimeTrackerAPI();

  useEffect(() => {
    loadTimeEntries();
  }, []);

  const loadTimeEntries = async () => {
    try {
      const entries = await api.getTimeEntries();
      setTimeEntries(entries.data);
    } catch (error) {
      console.error('Failed to load time entries:', error);
    }
  };

  const startTracking = async () => {
    // Start time tracking
    setIsTracking(true);
  };

  const stopTracking = async () => {
    // Stop time tracking
    setIsTracking(false);
  };

  return (
    <div className="time-tracker-widget">
      <h3>Time Tracker</h3>
      <button onClick={isTracking ? stopTracking : startTracking}>
        {isTracking ? 'Stop' : 'Start'} Tracking
      </button>
      {/* Display time entries */}
    </div>
  );
};
```

### Method 4: Database Sharing
```typescript
// Share the same database
// In your web project's backend
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: 'postgresql://user:pass@localhost:5432/guardian_tracker'
});

// Access the same data
const timeEntries = await prisma.timeEntry.findMany({
  where: { userId: currentUser.id }
});
```

## 🔧 Configuration Options

### Environment Variables
```env
# Add to your web project's .env
GUARDIAN_API_URL=http://localhost:3001
GUARDIAN_WS_URL=ws://localhost:3001
GUARDIAN_API_KEY=your-api-key
```

### Integration Config
```typescript
// guardian-config.ts
export const guardianConfig = {
  apiUrl: process.env.GUARDIAN_API_URL || 'http://localhost:3001',
  wsUrl: process.env.GUARDIAN_WS_URL || 'ws://localhost:3001',
  features: {
    timeTracking: true,
    screenshots: true,
    activityMonitoring: false, // Disable for web-only
    systemTray: false // Not available in web
  }
};
```

## 🌐 Use Cases

### 1. Employee Portal Integration
Embed time tracking in your existing employee portal:
```tsx
import { TimeTrackerWidget } from '@guardian/web-components';

function EmployeeDashboard() {
  return (
    <div>
      <h1>Employee Portal</h1>
      <TimeTrackerWidget userId={currentUser.id} />
      {/* Your existing components */}
    </div>
  );
}
```

### 2. Admin Dashboard Integration
Add time tracking management to your admin panel:
```tsx
import { AdminTimeTracker } from '@guardian/admin-components';

function AdminPanel() {
  return (
    <div>
      <h1>Admin Panel</h1>
      <AdminTimeTracker />
      {/* Your existing admin components */}
    </div>
  );
}
```

### 3. API-Only Integration
Use just the backend API without UI components:
```typescript
// Your web app can call Guardian API endpoints
const trackingData = await fetch('/api/guardian/time-entries');
const screenshots = await fetch('/api/guardian/screenshots');
```

## 🔒 Security Considerations

### Authentication
```typescript
// Sync authentication between your app and Guardian
export const syncAuth = async (userToken: string) => {
  // Validate token with Guardian backend
  const guardianAuth = await fetch('/api/guardian/validate-token', {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  
  return guardianAuth.ok;
};
```

### CORS Configuration
```typescript
// In Guardian backend (backend-api/src/index.ts)
app.use(cors({
  origin: [
    'http://localhost:3000', // Your web app
    'http://localhost:5173', // Guardian dashboards
  ],
  credentials: true
}));
```

## 📊 Data Synchronization

### Real-time Updates
```typescript
// Subscribe to Guardian events in your web app
const ws = new WebSocket('ws://localhost:3001');
ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'TIME_ENTRY_STARTED':
      updateUIForActiveTracking(data.payload);
      break;
    case 'SCREENSHOT_CAPTURED':
      notifyScreenshotTaken(data.payload);
      break;
  }
};
```

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install @guardian/shared
   ```

2. **Setup API Client**:
   ```typescript
   import { GuardianTimeTrackerAPI } from './guardian-api';
   const api = new GuardianTimeTrackerAPI('http://localhost:3001');
   ```

3. **Add Components**:
   ```tsx
   import { TimeTrackerWidget } from './components/TimeTrackerWidget';
   // Use in your app
   ```

4. **Configure Environment**:
   ```env
   GUARDIAN_API_URL=http://localhost:3001
   ```

That's it! Your web project can now leverage the Guardian Time Tracker system.