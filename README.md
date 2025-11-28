# Minilink

Minilink is a minimal URL shortener project with a Node/Express backend and a React frontend. This repository contains the backend API in `backend/` and the frontend React app in `frontend/`.

**Status:** Development-ready — follow the steps below to run locally.

---

**Project Structure**

- `backend/` - Express API, database init and link management.
- `frontend/` - React app (Create React App structure).
- `assests/` - Documentation and high-level design files.

---

**Prerequisites**

- Node.js (v16+ recommended)
- npm (comes with Node.js)
- A PostgreSQL instance if you want persistent storage (optional for initial local development depending on your backend config)

---

**Backend (API)**

1. Open a terminal and install dependencies:

```powershell
cd backend
npm install
```

2. Environment variables

Create a `.env` file in `backend/` (the project reads `process.env` via `dotenv`). Example values:

```text
# backend/.env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/minilink
```

3. Database

The backend includes a simple DB initialization helper at `src/config/initDb.js` — review it and ensure `DATABASE_URL` points to a running Postgres instance. If you don't have Postgres available, you can still run the backend to exercise non-persistent flows (adjust the config accordingly).

4. Run the backend

```powershell
# start normally
npm start

# or run in development with auto-reload (nodemon)
npm run dev
```

The backend's entrypoint is `src/server.js` and will print the server port and a health check URL on startup (e.g., `http://localhost:3000/healthz`).

---

**Frontend (React)**

1. Install dependencies:

```powershell
cd frontend
npm install
```

2. Run the frontend in development mode:

```powershell
npm start
```

3. Build for production:

```powershell
npm run build
```

Notes:
- The frontend uses `react-scripts`. By default it will attempt to proxy API requests to the backend when configured in `package.json` or a `proxy` setting — review `frontend/src/services/api.js` to confirm how API requests are formed.

---

**Available Scripts (from package.json)**

- Backend: `npm start` (node `src/server.js`), `npm run dev` (nodemon)
- Frontend: `npm start`, `npm run build`, `npm test`

---

**Troubleshooting & Tips**

- If you see CORS or network errors in the browser console, verify backend is running and `getBaseUrl()` in the frontend points to the correct backend URL.
- ESLint warnings for React hooks (e.g., `react-hooks/exhaustive-deps`) can be resolved by following hook rules: include all dependencies or move logic inside `useEffect` / wrap callbacks with `useCallback`.
- To inspect server logs, run the backend in the terminal where `npm start` is executed.

---

**Contributing**

Feel free to open issues or PRs. Keep changes small and focused. For code style, follow existing patterns in the codebase and run the linter where available.

---

**License**

This project doesn't include a license file. Add one if you plan to publish or share widely (e.g., MIT).

---

If you'd like, I can also:

- Add a minimal `.env.example` file in `backend/`.
- Create an npm script that runs both frontend and backend concurrently for local development.

---

File created: `README.md`
