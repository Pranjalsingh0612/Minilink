# High-Level Design: URL Shortener (Minilink)

## 1. Requirement Overview

A URL shortening service similar to bit.ly that allows users to:
- Create shortened URLs with optional custom codes
- Track click statistics (redirect count, last clicked time)
- Manage links (view, search, delete)
- View system health

**Tech Stack:** Node.js + Express (Backend), React (Frontend), PostgreSQL (Neon), Render (Hosting)

---

## 2. Architecture - High Level Design

![High Level Architecture](./assests/HLD.png)

---

## 3. Database Schema

### Table: `links`

| Column         | Type         | Constraints          | Description                    |
|----------------|--------------|----------------------|--------------------------------|
| id             | SERIAL       | PRIMARY KEY          | Auto-incrementing ID           |
| code           | VARCHAR(8)   | UNIQUE, NOT NULL     | Short code (6-8 chars: "aBc123") |
| long_url       | TEXT         | NOT NULL             | Original URL                   |
| click_count    | INTEGER      | DEFAULT 0            | Number of redirects            |
| last_clicked   | TIMESTAMP    | NULL                 | Last redirect timestamp        |
| created_at     | TIMESTAMP    | DEFAULT NOW()        | Creation timestamp             |

**Indexes:**
- Primary key on `id`
- Unique index on `code` (for fast lookups and preventing duplicates)

---

## 4. API Specification

### 4.1 Base URL
- **Development:** `http://localhost:3000`
- **Production:** `https://minilink.onrender.com`

### 4.2 Endpoints

| Method | Endpoint             | Description                      | Auth   |
|--------|----------------------|----------------------------------|--------|
| GET    | /healthz             | Health check                     | Public |
| POST   | /api/links           | Create short link                | Public |
| GET    | /api/links           | List all links                   | Public |
| GET    | /api/links/{code}    | Get link statistics              | Public |
| DELETE | /api/links/{code}    | Delete link                      | Public |
| GET    | /{code}              | Redirect to original URL         | Public |

### 4.3 Request/Response Examples

#### POST /api/links
**Request:**
```json
{
  "longUrl": "https://example.com/very/long/url",
  "customCode": "mylink"  // Optional
}
```
**Response (201):**
```json
{
  "code": "mylink",
  "longUrl": "https://example.com/very/long/url",
  "shortUrl": "https://minilink.onrender.com/mylink",
  "createdAt": "2025-11-27T10:30:00Z"
}
```
**Response (200):** Same URL + code returns existing link (idempotent)  
**Response (409):** Code already exists with different URL  
**Response (400):** Invalid URL or code format

#### GET /api/links
**Response (200):**
```json
[
  {
    "code": "mylink",
    "longUrl": "https://example.com/very/long/url",
    "clickCount": 42,
    "lastClicked": "2025-11-27T10:30:00Z",
    "createdAt": "2025-11-26T10:30:00Z"
  }
]
```

#### GET /api/links/{code}
**Response (200):**
```json
{
  "code": "mylink",
  "longUrl": "https://example.com/very/long/url",
  "clickCount": 42,
  "lastClicked": "2025-11-27T10:30:00Z"
}
```
**Response (404):** Link not found

#### DELETE /api/links/{code}
**Response (204):** No content (success)
**Response (404):** Link not found

#### GET /{code}
**Response (302):** Redirect to original URL
**Response (404):** Link not found

#### GET /healthz
**Response (200):**
```json
{
  "ok": true,
  "version": "1.0",
  "uptime": 3600,
  "timestamp": "2025-11-27T10:30:00Z"
}
```

---

## 5. Frontend Pages

### 5.1 Dashboard (`/`)
- **Purpose:** Main management interface
- **Features:**
  - Table showing all links (code, long URL, click count, actions)
  - Add new link form (with optional custom code field)
  - Delete button for each link
  - Search/filter by code or URL
  - Copy short URL button
- **States:** Empty, loading, error, success

### 5.2 Stats Page (`/code/:code`)
- **Purpose:** View detailed statistics for a specific link
- **Features:**
  - Display long URL
  - Redirect count
  - Last clicked timestamp
  - Back to dashboard button
- **States:** Loading, error, not found

### 5.3 Health Check (`/healthz`)
- **Purpose:** System status monitoring
- **Features:**
  - Status indicator (OK/Error)
  - Version number
  - Uptime display
  - Timestamp
- **States:** Loading, error

---

## 6. Short Code Generation

### 6.1 Custom Code
- User provides custom code (e.g., "aBc123XY")
- Validation: **6-8 alphanumeric characters only** `[A-Za-z0-9]{6,8}`
- No special characters, hyphens, or underscores allowed
- Case-sensitive
- Check uniqueness before creation

### 6.2 Auto-Generated Code
- If no custom code provided, generate random 6-character alphanumeric string
- Use base62 encoding (a-z, A-Z, 0-9) for readability

---

## 7. Error Handling

### Backend
- **400 Bad Request:** Invalid input (malformed URL, invalid code format)
- **404 Not Found:** Link code doesn't exist
- **409 Conflict:** Custom code already exists
- **500 Internal Server Error:** Database or server errors

### Frontend
- Show user-friendly error messages
- Display loading spinners during API calls
- Handle network errors gracefully
- Show empty states when no data

---

## 8. Validation Rules

### URL Validation
- Must start with `http://` or `https://`
- Maximum length: 2048 characters
- Must be a valid URL format

### Code Validation
- **Pattern:** `[A-Za-z0-9]{6,8}` (6-8 alphanumeric characters only)
- Length: 6-8 characters
- Allowed: uppercase letters (A-Z), lowercase letters (a-z), digits (0-9)
- Case-sensitive
- No spaces, hyphens, underscores, or any special characters

---

## 9. File Structure

```
minilink/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── utils/           # Helpers (code generator, validator)
│   │   ├── middleware/      # Error handling, logging
│   │   └── app.js           # Express app setup
│   ├── tests/               # Unit tests
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Dashboard, Stats, Health
│   │   ├── services/        # API client
│   │   ├── utils/           # Helpers
│   │   └── App.js
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── HLD.md                   # This document
```
---
