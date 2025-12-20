# LandlordBD

Property and tenant management platform with a Laravel 11 API backend and a React (Vite) frontend.

## Repository layout

- `backend/` – Laravel 11 API secured with Sanctum; handles buildings, units, tenants, rental agreements, payments, dashboard metrics, and workspace settings.
- `frontend/` – React 18 + Vite single-page app that consumes the API and manages authentication/session state.

## Prerequisites

- PHP 8.2+, Composer
- Node.js 18+ and npm
- A PostgreSQL or MySQL database (configure in `backend/.env`)

## Quick start

1) **Backend**

```bash
cd backend
cp .env.example .env          # fill database + app URLs
composer install
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

Key environment values:

- `APP_URL` – base URL for the API (e.g., `http://localhost:8000`)
- `CORS_ALLOWED_ORIGINS` – comma-separated front-end origins (e.g., `http://localhost:5173`)
- `SANCTUM_STATEFUL_DOMAINS` – hostnames allowed for session cookies (leave `localhost,127.0.0.1` for local dev)
- `DB_*` – database connection details

2) **Frontend**

```bash
cd frontend
cp .env.example .env          # VITE_API_BASE_URL should match backend APP_URL
npm install
npm run dev                   # serves at http://localhost:5173
```

## Development notes

- The API is namespaced under `/api`; the frontend client automatically appends `/api` to `VITE_API_BASE_URL`.
- Authentication uses Laravel Sanctum bearer tokens stored in `localStorage`; tokens are attached automatically by `src/api/client.js`.
- Run `php artisan migrate:fresh --seed` during active development if you introduce seeds; migrations live in `backend/database/migrations`.
- Tailwind CSS utilities and component classes are defined in `frontend/src/index.css`.

## Testing

- Backend: `php artisan test` (from `backend/`)
- Frontend: `npm test` or add your preferred runner; Vite dev server provides hot module reload for manual QA.