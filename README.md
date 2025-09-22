# Guardian Employee Platform Monorepo

This repository contains two related codebases you are collaborating on:

1. `employee-dashboard` (MongoDB based) – Employee & Admin HTML dashboard with attendance, session time tracking, claims & training tools.
2. `time-tracker` (multi-package workspace) – Advanced tracking system including:
   - `backend-api` (TypeScript + Prisma + Postgres design)
   - `desktop-app` (Electron + React screenshot/time capture)
   - `admin-dashboard` (React + Vite)
   - `shared` (reusable types/utilities)
   - `client-integration` & `integration-examples`

> NOTE: Your live focus right now is MongoDB. The Prisma/Postgres backend can be optional/future or adapted to Mongo.

---
## Quick Start (Employee Dashboard Only)
```bash
cd employee-dashboard
cp .env.example .env   # add your real MongoDB URI + JWT secret
npm install
npm start              # http://localhost:5000
```

## Quick Start (Time Tracker Workspace)
```bash
cd time-tracker
npm install                 # installs all workspace deps
cp backend-api/.env.example backend-api/.env   # set DATABASE_URL if using Postgres
npm run dev:backend         # backend API
npm run dev:admin           # admin dashboard (React)
npm run dev:desktop         # electron dev (separate window)
```

---
## Environment Variables (.env)
Create a `.env` file in each package that needs one using its `.env.example`:
| Package | Variables |
|---------|-----------|
| employee-dashboard | MONGO_URI, PORT, NODE_ENV, JWT_SECRET |
| backend-api | DATABASE_URL, JWT_SECRET |
| admin-dashboard | VITE_API_URL |
| desktop-app | (future) API_URL, UPDATE_FEED_URL |

Never commit real secrets. Only commit `.env.example` files with placeholders.

---
## Suggested Folder Structure (after rename cleanup)
```
root/
  employee-dashboard/
  time-tracker/
    backend-api/
    admin-dashboard/
    desktop-app/
    shared/
    client-integration/
    integration-examples/
  README.md
  .gitignore
```

---
## Collaboration Workflow
```bash
git clone <repo-url>
cd repo
# create a feature branch
git checkout -b feature/add-attendance-export
# make changes
git add .
git commit -m "Add attendance export endpoint"
git push origin feature/add-attendance-export
# open Pull Request on GitHub
```

### Simple Term Explanations
| Term | Plain Meaning |
|------|---------------|
| Repository | A folder of code on GitHub |
| Branch | A separate copy to work on features safely |
| Commit | A saved snapshot of your changes |
| Pull Request | Asking to merge your branch into main |
| Environment Variable | Config/secret outside code (e.g. DB URL) |
| Deployment | Putting app online |
| MongoDB Atlas | Cloud Mongo database service |

---
## Deploying Employee Dashboard (Example: Render)
1. Push repo to GitHub.
2. In Render: New Web Service -> point to `employee-dashboard` folder.
3. Environment Variables: copy from `.env.example` (add real values).
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Open generated URL -> `/api/health` should return JSON.

### Deploying to a VPS (Generic)
```bash
ssh user@server
sudo apt update && sudo apt install -y nodejs npm
mkdir app && cd app
# clone repo and set up
npm install --production
npm install -g pm2
pm2 start server.js --name employee-dashboard
pm2 save
# add Nginx reverse proxy + SSL (Certbot)
```

---
## Hardening TODO (Before Public Production)
- Add server-side JWT auth middleware to protect API routes.
- Add missing `404.html` + `favicon.ico` to reduce 404 noise.
- Remove duplicate Mongo indexes (clean schema definitions).
- Add minimal Jest tests (health, auth, time tracking start/stop).
- Decide whether to keep Postgres backend or migrate to Mongo.
- Add CI (GitHub Actions) for install + lint + test.

---
## Recent Additions
- Added `employee-dashboard/.env.example`
- Added `time-tracker` package .env examples
- Added `employee-dashboard/middleware/auth.js` (JWT verify placeholder)
- Added `employee-dashboard/404.html`

---
## License
`employee-dashboard` is MIT. Workspace packages marked PRIVATE should remain private unless you choose to open source.

---
## Support / Issues
Open a GitHub Issue with: steps to reproduce, expected result, actual result, logs.

---
## Initialize Git Repository
If this folder is not yet a git repo:

```bash
git init
git add .
git commit -m "chore: initial import (employee dashboard + time tracker)"
```

Then create a new empty GitHub repository (no README) and run:

```bash
git remote add origin https://github.com/YOUR_ACCOUNT/guardian-employee-platform.git
git branch -M main
git push -u origin main
```

Create a feature branch for future work:
```bash
git checkout -b feature/secure-jwt-auth
```

---
Built for internal productivity. Ready to grow as your unified platform.
