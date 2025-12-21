# Frontend (React + Vite)

## Install, Dev, Build

* `npm install`
* `npm run dev` (opens [http://localhost:5173](http://localhost:5173))
* `npm run build`

## Environment Variables

Configure a `.env` file (see `frontend/.env.example` if available):

```
VITE_API_BASE_URL=https://landlordbd-1.onrender.com
```

See the root README API base URL notes for the canonical value and deployment details.

## API Client & Auth Token

* API client lives in `src/api/client.js` (re-exported from `src/api/axiosInstance.js`).
* `VITE_API_BASE_URL` is normalized to always hit `/api`.
* Bearer token is read from `localStorage` and attached automatically via an Axios request interceptor.
* Auth context (`src/context/AuthContext.jsx`) persists the token in `localStorage` on login/register and clears it on logout or session expiry.

## App Structure

* Routing is configured in `src/App.jsx` using `react-router-dom` with a `ProtectedRoute` guard for authenticated screens.
* Global auth state lives in `src/context/AuthContext.jsx` and is provided at the application root.
* Pages live under `src/pages/*`:

  * Landing
  * Login
  * Register
  * Dashboard
  * Buildings
  * Units
  * Tenants
  * Agreements
  * Payments
  * Outstanding
  * Profile
  * Settings
  * NotFound
* Shared layout and components live in `src/components/*` (e.g., `ProtectedRoute`, `Layout`, and UI atoms in `src/components/ui`).

## Scripts

* Development server: `npm run dev`
* Production build: `npm run build`
* Install dependencies: `npm install`
* Tests: Not configured by default (add your preferred runner if needed)
