# LandlordBD

Property and tenant management platform with a Laravel 11 API backend and a React (Vite) frontend.
Full-stack property management app

**Frontend:** React (Vite)
**Backend:** Laravel API (Sanctum token auth)
**Database:** PostgreSQL (Neon)

## Repository layout

* `backend/` – Laravel 11 API secured with Sanctum; handles buildings, units, tenants, rental agreements, payments, dashboard metrics, and workspace settings.
* `frontend/` – React 18 + Vite single-page app that consumes the API and manages authentication/session state.

## 🚀 Live Deployments

## Prerequisites

| Component            | URL                                                                              |
| -------------------- | -------------------------------------------------------------------------------- |
| Frontend (Netlify)   | [https://landlordbd.netlify.app/](https://landlordbd.netlify.app/)               |
| Backend API (Render) | [https://landlordbd-1.onrender.com/api/](https://landlordbd-1.onrender.com/api/) |

* PHP 8.2+, Composer
* Node.js 18+ and npm
* A PostgreSQL or MySQL database (configure in `backend/.env`)

## Quick start

## 📦 Stack

* **Frontend:** React + Vite
* **Backend:** Laravel 11 API with Sanctum (Bearer token auth)
* **Database:** PostgreSQL on Neon
* **Hosting:** Frontend on Netlify, Backend on Render

## 🧠 Architecture Overview

* The React frontend fetches data from the Laravel backend using Bearer tokens.
* Laravel uses Laravel Sanctum’s token system (`auth:sanctum` middleware).
* No cookie or session auth is used — only token auth.
* CORS is configured for token-based cross-origin API calls.

## ⚙ Environment Variables

### Frontend (Netlify)

Go to Netlify → Site settings → Build & deploy → Environment:

```
VITE_API_BASE_URL=https://landlordbd-1.onrender.com
```

Netlify will run your build with this base URL.

### Backend (Render)

Add these to your service’s **Environment** on Render:

```
APP_ENV=production
APP_DEBUG=false
APP_URL=https://landlordbd-1.onrender.com

DB_CONNECTION=pgsql
DB_HOST=<your-neon-host>
DB_PORT=5432
DB_DATABASE=<your-neon-db>
DB_USERNAME=<your-neon-user>
DB_PASSWORD=<your-neon-password>

APP_KEY=base64:<your-laravel-appkey>
```

> Do **not commit** these values to GitHub.

## 📶 API Base

All backend APIs are under:

```
https://landlordbd-1.onrender.com/api/
```

Examples:

* Login: `POST /api/login`
* Fetch current user: `GET /api/me`
* Health check: `GET /api/health`

## 🧪 Local Development

### Backend (Laravel)

```bash
cd backend
cp .env.example .env          # fill database + app URLs
composer install
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

Key environment values:

* `APP_URL` – base URL for the API (e.g., `http://localhost:8000`)
* `CORS_ALLOWED_ORIGINS` – comma-separated front-end origins (e.g., `http://localhost:5173`)
* `SANCTUM_STATEFUL_DOMAINS` – hostnames allowed for session cookies (local dev only)
* `DB_*` – database connection details

### Frontend (React)

```bash
cd frontend
cp .env.example .env          # VITE_API_BASE_URL should match backend APP_URL
npm install
npm run dev                   # serves at http://localhost:5173
```

## 🛠 Deployment Notes

### Netlify (Frontend)

* Base directory: `frontend`
* Build command: `npm run build`
* Publish directory: `dist`
* Add SPA rewrite rule using `_redirects` or `netlify.toml`:

```
/*    /index.html   200
```

### Render (Backend)

* Deploy type: Docker
* App listens on `$PORT`
* Ensure `Dockerfile` and `start.sh` are configured correctly

## 🧠 Token Authentication (Sanctum)

This app uses **Sanctum token auth**:

1. User logs in → Backend returns a token
2. Frontend stores the token in `localStorage`
3. Every request uses the token:

```
Authorization: Bearer <token>
```

No cookies or CSRF are used.

## 🧾 API Routes (Quick List)

| Method | Path             | Description                      |
| ------ | ---------------- | -------------------------------- |
| POST   | `/api/login`     | Login user                       |
| POST   | `/api/register`  | Register user                    |
| GET    | `/api/me`        | Get logged-in user (auth)        |
| GET    | `/api/buildings` | List buildings                   |
| …      | …                | Protected routes use Bearer auth |

## 📁 Folder Structure

```
LandlordBD/
  backend/        # Laravel API
  frontend/       # React + Vite SPA
  netlify.toml    # Netlify config (optional)
  README.md
```

* The API is namespaced under `/api`
* The frontend client automatically appends `/api` to `VITE_API_BASE_URL`
* Authentication uses Laravel Sanctum bearer tokens stored in `localStorage`
* Tokens are attached automatically by `src/api/client.js`
* Migrations live in `backend/database/migrations`
* Tailwind CSS utilities are defined in `frontend/src/index.css`

## Testing

* Backend: `php artisan test` (from `backend/`)
* Frontend: `npm test` or your preferred runner

## 📜 License & Contributing

Feel free to contribute via pull requests.