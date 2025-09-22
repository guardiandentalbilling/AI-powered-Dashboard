# Guardian Time Tracker

A comprehensive employee time tracking application similar to Upwork's time tracker, featuring desktop client, web dashboards, and secure screenshot monitoring.

## Project Structure

```
guardian-time-tracker/
├── desktop-app/          # Electron desktop application for employees
├── backend-api/          # Node.js/Express backend API
├── admin-dashboard/      # React admin web dashboard
├── employee-dashboard/   # React employee web interface
├── shared/              # Shared types and utilities
├── docs/                # Documentation
└── docker/              # Docker configuration files
```

## Features

### Desktop Application
- Time tracking with start/stop/pause functionality
- Automatic screenshot capture (2 screenshots per 10 minutes = 12 per hour)
- Random interval screenshot timing for security
- System tray notifications
- Shutter sound on screenshot capture
- Secure data synchronization with backend

### Admin Dashboard
- Employee management and monitoring
- Time reports and analytics
- Screenshot viewing and management
- Project and task assignment
- Real-time activity monitoring

### Employee Dashboard
- Personal time logs viewing
- Profile management
- Task assignments
- Basic reporting

### Security Features
- JWT authentication
- Encrypted screenshot storage
- API rate limiting
- Secure communication protocols
- Data encryption at rest and in transit

## Technology Stack

- **Desktop App**: Electron + React + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens
- **File Storage**: Encrypted local storage + cloud backup
- **Real-time**: Socket.io for live updates

## Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- Git

### Installation
1. Clone the repository
2. Install dependencies in each module
3. Set up environment variables
4. Run database migrations
5. Start development servers

## Development

Each module can be developed independently:

```bash
# Desktop app
cd desktop-app && npm run dev

# Backend API  
cd backend-api && npm run dev

# Admin dashboard
cd admin-dashboard && npm run dev

# Employee dashboard
cd employee-dashboard && npm run dev
```

## Security Considerations

- All screenshots are encrypted before storage
- API endpoints are rate-limited and authenticated
- User sessions are managed securely
- Data is transmitted over HTTPS only
- Regular security audits and updates

## License

Private - Guardian Dental Billing LLC

## Support

For support and questions, contact the development team.