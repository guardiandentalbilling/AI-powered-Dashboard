# Guardian Time Tracker - Client Integration Guide

## 🔗 How to Add Time Tracker Button to Your Project

This guide shows you how to add a **Time Tracker** button to any existing web project that will link to the Guardian Time Tracker application.

## 📁 Files to Copy

Copy these files to your project:
1. `TimeTrackerButton.tsx` - React component
2. `TimeTrackerButton.css` - Styles
3. This integration guide

## 🚀 Quick Integration

### Option 1: Simple Button (Recommended)
```tsx
import { QuickTimeTracker } from './path/to/TimeTrackerButton';

function YourComponent() {
  const currentUser = {
    id: 'user123',
    email: 'john@company.com',
    firstName: 'John',
    lastName: 'Doe'
  };

  return (
    <div>
      <h1>Employee Dashboard</h1>
      
      {/* Add Time Tracker Button */}
      <QuickTimeTracker 
        user={currentUser}
        onTimeTrackingChange={(isTracking) => {
          console.log('Time tracking:', isTracking ? 'Started' : 'Stopped');
        }}
      />
      
      {/* Your existing content */}
    </div>
  );
}
```

### Option 2: Floating Button
```tsx
import { FloatingTimeTracker } from './path/to/TimeTrackerButton';

function App() {
  return (
    <div>
      {/* Your app content */}
      
      {/* Floating Time Tracker in bottom-right corner */}
      <FloatingTimeTracker 
        position="bottom-right"
        user={currentUser}
      />
    </div>
  );
}
```

### Option 3: Custom Button
```tsx
import TimeTrackerButton from './path/to/TimeTrackerButton';

function CustomIntegration() {
  return (
    <TimeTrackerButton
      timeTrackerUrl="http://localhost:3000"
      user={currentUser}
      variant="primary"
      size="large"
      displayMode="modal"  // Opens in modal instead of new tab
      onTimeTrackingChange={(isTracking, timeEntry) => {
        // Handle time tracking events
        if (isTracking) {
          // User started tracking
          console.log('Started tracking:', timeEntry);
        } else {
          // User stopped tracking
          console.log('Stopped tracking');
        }
      }}
    />
  );
}
```

## 🎨 Button Variants

### Variants
- `primary` - Blue gradient (default)
- `secondary` - Gray gradient  
- `outline` - Transparent with border
- `minimal` - Light gray background

### Sizes
- `small` - Compact button
- `medium` - Standard size (default)
- `large` - Larger button

### Display Modes
- `newTab` - Opens in new browser tab (default)
- `modal` - Opens in overlay modal
- `iframe` - Embeds in iframe

## 🔧 Integration Examples

### In a Navigation Bar
```tsx
function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>
        
        {/* Time Tracker Button */}
        <QuickTimeTracker user={currentUser} />
      </div>
    </nav>
  );
}
```

### In a Dashboard Widget
```tsx
function DashboardWidgets() {
  return (
    <div className="dashboard-grid">
      <div className="widget">
        <h3>Quick Actions</h3>
        <div className="widget-actions">
          <button>Create Task</button>
          <button>View Calendar</button>
          
          {/* Time Tracker Integration */}
          <TimeTrackerButton
            variant="outline"
            size="medium"
            displayMode="modal"
          />
        </div>
      </div>
    </div>
  );
}
```

### As a Sidebar Item
```tsx
function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        <li><a href="/dashboard">Dashboard</a></li>
        <li><a href="/tasks">Tasks</a></li>
        <li>
          {/* Time Tracker as menu item */}
          <TimeTrackerButton
            variant="minimal"
            size="small"
            displayMode="newTab"
            className="sidebar-time-tracker"
          />
        </li>
      </ul>
    </aside>
  );
}
```

## 📱 Mobile Responsive

The button automatically adapts to mobile screens:
- Smaller padding on mobile
- Touch-friendly button sizes
- Responsive modal sizing

## 🎯 Features

### ✅ What the Button Provides:
- **Visual indicator** when time tracking is active
- **Real-time timer** display showing elapsed time
- **Quick controls** for pause/stop when tracking
- **User context** passed to Guardian Time Tracker
- **Multiple display modes** (new tab, modal, iframe)
- **Customizable appearance** (variants, sizes, colors)
- **Responsive design** for all devices
- **TypeScript support** with full type definitions

### 🔄 Real-time Features:
- Shows active/inactive status
- Displays current tracking time
- Updates automatically
- Provides quick stop/pause controls

## ⚙️ Configuration

### Environment Setup
```typescript
// Configure the Time Tracker URL based on environment
const TIME_TRACKER_CONFIG = {
  development: 'http://localhost:3000',
  staging: 'https://timetracker-staging.yourcompany.com',
  production: 'https://timetracker.yourcompany.com'
};

const timeTrackerUrl = TIME_TRACKER_CONFIG[process.env.NODE_ENV];
```

### User Context
The button automatically passes user information to the Guardian Time Tracker:
```typescript
interface User {
  id: string;           // Required: Unique user identifier
  email: string;        // Required: User email
  firstName: string;    // Optional: Display name
  lastName: string;     // Optional: Display name
}
```

## 🎨 Styling

### CSS Custom Properties
You can customize colors using CSS variables:
```css
.time-tracker-button {
  --tt-primary-color: #your-brand-color;
  --tt-primary-hover: #your-hover-color;
  --tt-border-radius: 12px;
}
```

### Framework Integration
Works with popular CSS frameworks:
- **Bootstrap** - Compatible with btn classes
- **Tailwind CSS** - Can use utility classes
- **Material-UI** - Integrates with MUI themes
- **Ant Design** - Works with Ant button styles

## 🔧 API Integration

### Future API Connection
When the Guardian Time Tracker backend is ready, the button will:
1. Check real-time tracking status
2. Start/stop tracking via API calls
3. Sync time entries automatically
4. Show accurate timer data
5. Handle authentication seamlessly

### Current State (Demo Mode)
Currently runs in demo mode with simulated time tracking.

## 📋 Next Steps

1. **Copy the integration files** to your project
2. **Import the component** where you want the button
3. **Pass user information** to link accounts
4. **Customize appearance** to match your design
5. **Test different display modes** to find what works best

## 🚀 Ready to Use!

The Time Tracker button is ready to integrate into any web project. It provides a seamless way for your users to access the Guardian Time Tracker without leaving your application.

**Questions or need help with integration?** The component is designed to be plug-and-play with minimal configuration required!