# Backend (Laravel 11 + Sanctum)

LandlordBD API for managing buildings, units, tenants, rental agreements, payments, dashboard summaries, and workspace settings.

## Setup

```bash
cd backend
cp .env.example .env          # configure APP_URL, DB_*, SANCTUM_STATEFUL_DOMAINS, CORS_ALLOWED_ORIGINS
composer install
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```

### Environment helpers

- `APP_URL` should match the URL the frontend points to (default `http://localhost:8000`).
- `CORS_ALLOWED_ORIGINS` must include your frontend origin (e.g., `http://localhost:5173`).
- `SANCTUM_STATEFUL_DOMAINS` should list hosts allowed for cookie-based auth; keep `localhost,127.0.0.1` for local dev.
- `FILESYSTEM_DISK=public` exposes uploaded files under `storage/app/public` if you add uploads later.

## Authentication

- Register: `POST /api/register` → returns `{ token, user }`
- Login: `POST /api/login` → returns `{ token, user }`
- Authenticated routes expect the bearer token from `Authorization: Bearer <token>`.
- Session verification endpoint: `GET /api/me`; logout via `POST /api/logout`.

## Core routes

- **Buildings** `/api/buildings` CRUD with unit counts; buildings are scoped to the authenticated user.
- **Units** `/api/buildings/{building}/units` for create/list and `/api/units/{unit}` for updates/deletes.
- **Tenants** `/api/tenants` CRUD; tenants scoped to the authenticated user.
- **Rental agreements** `/api/agreements` CRUD plus `/api/agreements/{id}/end` to terminate.
- **Payments** `/api/payments` create/update and `/api/outstanding` for overdue balances.
- **Dashboard** `/api/dashboard/summary` returns aggregate metrics for the signed-in user.
- **Workspace settings** `/api/settings/workspace` show/update branding and contact info for the workspace.

See `routes/api.php` for the authoritative route list. Validation and ownership scoping live in the controllers inside `app/Http/Controllers/`.

## Database

Migrations are located in `database/migrations/` and cover users, buildings, units, tenants, rental agreements, payments, and workspace settings. Run `php artisan migrate:fresh` to reset your local database during development.

## Useful commands

- Clear caches after changing config/env: `php artisan config:clear && php artisan cache:clear`
- Rerun migrations: `php artisan migrate:fresh`
- Inspect routes: `php artisan route:list --path=api`