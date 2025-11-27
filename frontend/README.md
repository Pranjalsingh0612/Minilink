# Minilink Frontend

React-based frontend application for the Minilink URL shortener service.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Structure](#project-structure)
- [Pages and Routes](#pages-and-routes)
- [UI/UX Features](#uiux-features)

## Features

- ✅ **Dashboard:** View all links, create new links, delete links, search/filter
- ✅ **Stats Page:** View detailed statistics for individual links
- ✅ **Health Check:** Monitor system status and uptime
- ✅ **Responsive Design:** Works seamlessly on desktop, tablet, and mobile
- ✅ **Loading States:** Clear loading indicators for all async operations
- ✅ **Error Handling:** User-friendly error messages
- ✅ **Form Validation:** Inline validation with helpful error messages
- ✅ **Copy to Clipboard:** Quick copy functionality for short URLs
- ✅ **Search/Filter:** Filter links by code or URL
- ✅ **Empty States:** Informative empty state messages

## Tech Stack

- **Framework:** React 18.2
- **Routing:** React Router DOM 6.20
- **Build Tool:** Create React App
- **Styling:** Pure CSS (no external UI libraries)

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **Backend API** running (see backend README)

## Installation

1. **Navigate to frontend directory:**
   ```powershell
   cd frontend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

## Configuration

1. **Create a `.env` file** in the `frontend/` directory:
   ```powershell
   cp .env.example .env
   ```

2. **Update the `.env` file:**
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```

### Environment Variables

| Variable            | Description                    |
|---------------------|--------------------------------|
| `REACT_APP_API_URL` | Backend API base URL           |

**Note:** Environment variables in React must start with `REACT_APP_` prefix.

## Running the Application

### Development Mode

Start the development server with hot reload:

```powershell
npm start
```

The application will open automatically in your browser at `http://localhost:3001`.

**Note:** If port 3000 is used by the backend, React will automatically use port 3001.

### Verify the application is running:

Open your browser and navigate to:
```
http://localhost:3001
```

You should see the Minilink dashboard.

## Building for Production

### Create optimized production build:

```powershell
npm run build
```

This creates a `build/` folder with optimized static files ready for deployment.

### Test the production build locally:

```powershell
# Install serve globally (if not already installed)
npm install -g serve

# Serve the build folder
serve -s build -p 3001
```

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js           # Navigation header
│   │   ├── Loading.js          # Loading spinner component
│   │   └── EmptyState.js       # Empty state component
│   ├── pages/
│   │   ├── Dashboard.js        # Main dashboard page
│   │   ├── Stats.js            # Link statistics page
│   │   └── HealthCheck.js      # Health check page
│   ├── services/
│   │   └── api.js              # API service layer
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── App.js                  # Main app component with routing
│   ├── App.css                 # Global styles
│   └── index.js                # React entry point
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## Pages and Routes

| Page           | Route           | Description                                      |
|----------------|-----------------|--------------------------------------------------|
| Dashboard      | `/`             | List all links, create new links, delete links  |
| Stats          | `/code/:code`   | View statistics for a specific link             |
| Health Check   | `/healthz`      | View system health status and uptime             |

### Page Details

#### 1. Dashboard (`/`)

**Features:**
- Add new link form with URL and optional custom code
- Search/filter links by code or URL
- Table showing all links with:
  - Short code
  - Long URL (truncated)
  - Click count
  - Created date
  - Action buttons (Copy, Stats, Delete)
- Real-time form validation
- Success/error messages
- Empty state when no links exist

#### 2. Stats Page (`/code/:code`)

**Features:**
- Display short code prominently
- Show original long URL (clickable to copy)
- Show short URL (clickable to copy)
- Display total click count
- Display last clicked timestamp
- Back to dashboard button
- Open link button

#### 3. Health Check (`/healthz`)

**Features:**
- System status indicator (healthy/unhealthy)
- API version
- Uptime in human-readable format
- Uptime in seconds
- Last checked timestamp
- Auto-refresh every 30 seconds
- Manual refresh button
- System information panel
