# Minilink Backend

Backend API for URL shortener service built with Node.js, Express, and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)

## Features

- ✅ Create short URLs with auto-generated or custom codes
- ✅ Redirect to original URLs with click tracking
- ✅ View click statistics (count, last clicked time)
- ✅ List all links
- ✅ Delete links
- ✅ Health check endpoint
- ✅ Code validation: `[A-Za-z0-9]{6,8}`
- ✅ URL validation (must start with http:// or https://)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **Environment:** dotenv

## Architecture

The backend follows a **3-layer architecture**

```
Controller Layer (HTTP) → Service Layer (Business Logic) → Repository Layer (Data Access)
```

- **Controllers:** Handle HTTP requests/responses
- **Services:** Contain business logic and validation
- **Repositories:** Manage database operations
- **Utils:** Reusable helpers (validators, generators)
- **Middleware:** Error handling, logging

## Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **PostgreSQL database** (Neon or local)

## Installation

1. **Navigate to backend directory:**
   ```powershell
   cd backend
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

## Configuration

1. **Create a `.env` file** in the `backend/` directory:
   ```powershell
   cp .env.example .env
   ```

2. **Update the `.env` file** with your configuration:
   ```env
   DATABASE_URL=postgresql://username:password@host:5432/database?sslmode=require
   PORT=3000
   BASE_URL=http://localhost:3000
   NODE_ENV=development
   ```

### Environment Variables

| Variable       | Description                          |
|----------------|--------------------------------------|
| `DATABASE_URL` | PostgreSQL connection string         |
| `PORT`         | Server port                          |
| `BASE_URL`     | Base URL for short links             |
| `NODE_ENV`     | Environment (development/production) |

## ▶️ Running the Application

### Development Mode (with auto-restart)
```powershell
npm run dev
```

### Production Mode
```powershell
npm start
```

The server will start on the port specified in `.env` (default: 3000).

### Verify the server is running:
```powershell
# Using curl
curl http://localhost:3000/healthz

# Using browser
# Visit: http://localhost:3000/healthz
```

Expected response:
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 12,
  "timestamp": "2025-11-27T10:30:00.000Z"
}
```

## API Endpoints

### Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://minilink.onrender.com`

### Endpoints

| Method | Endpoint             | Description                      | Request Body                          | Success Response |
|--------|----------------------|----------------------------------|---------------------------------------|------------------|
| GET    | `/healthz`           | Health check                     | -                                     | 200              |
| POST   | `/api/links`         | Create short link                | `{ longUrl, customCode? }`            | 201              |
| GET    | `/api/links`         | List all links                   | -                                     | 200              |
| GET    | `/api/links/:code`   | Get link statistics              | -                                     | 200              |
| DELETE | `/api/links/:code`   | Delete link                      | -                                     | 204              |
| GET    | `/:code`             | Redirect to original URL         | -                                     | 302              |

## 🗄️ Database Schema

### Table: `links`

| Column         | Type         | Constraints          | Description                    |
|----------------|--------------|----------------------|--------------------------------|
| `id`           | SERIAL       | PRIMARY KEY          | Auto-incrementing ID           |
| `code`         | VARCHAR(8)   | UNIQUE, NOT NULL     | Short code (6-8 chars)         |
| `long_url`     | TEXT         | NOT NULL             | Original URL                   |
| `click_count`  | INTEGER      | DEFAULT 0            | Number of redirects            |
| `last_clicked` | TIMESTAMP    | NULL                 | Last redirect timestamp        |
| `created_at`   | TIMESTAMP    | DEFAULT NOW()        | Creation timestamp             |

**Indexes:**
- Primary key on `id`
- Unique index on `code`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # PostgreSQL connection pool
│   │   └── initDb.js           # Database initialization
│   ├── controllers/
│   │   ├── linkController.js   # Link HTTP handlers
│   │   └── healthController.js # Health check handler
│   ├── services/
│   │   └── linkService.js      # Business logic layer
│   ├── repositories/
│   │   └── linkRepository.js   # Data access layer
│   ├── routes/
│   │   ├── linkRoutes.js       # API link routes
│   │   ├── redirectRoutes.js   # Redirect routes
│   │   └── healthRoutes.js     # Health routes
│   ├── utils/
│   │   ├── urlValidator.js     # URL validation utility
│   │   ├── codeValidator.js    # Code validation utility
│   │   └── codeGenerator.js    # Random code generator
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error handling
│   ├── app.js                  # Express app configuration
│   └── server.js               # Server entry point
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```
