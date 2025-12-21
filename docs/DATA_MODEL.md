# Data Model Overview

This document summarizes the core entities used by **LandlordBD**, their key columns, and how they relate to each other.

## Main Entities

### Users (`users`)

* Core account table storing `name`, unique `email`, hashed `password`, optional `phone`, and `role` (defaults to `landlord`).
* Owns buildings, tenants, rental agreements, payments, and workspace settings.
* Deleting a user cascades into all dependent records.

### Buildings (`buildings`)

* Belongs to a user via `user_id` with cascade delete.
* Tracks `name`, address fields, optional `city`, `state`, `zip_code`, and optional `total_floors`.
* Deleting a building cascades to its units.

### Units (`units`)

* Belongs to a building via `building_id` with cascade delete.
* Inherits user ownership through the building relationship.
* Stores `unit_number`, optional `floor`, optional `type`, `rent_amount`, and `status` enum (`vacant` by default, `occupied`).

### Tenants (`tenants`)

* Belongs directly to a user via `user_id` with cascade delete.
* Stores tenant contact information including `name`, `phone`, optional `whatsapp`, `email`, and `address`.

### Rental Agreements (`rental_agreements`)

* Scoped to a user and linked to both a tenant and a unit.
* All foreign keys cascade on delete.
* Tracks:

  * `start_date`
  * optional `end_date`
  * optional `end_date_actual`
  * `monthly_rent`
  * `security_deposit`
  * `status`
  * optional `notes`
  * timestamps

**Constraints and Indexes**

* Partial unique index enforces **only one active agreement per unit** when `end_date_actual` is `NULL` and `status = 'active'`.
* Check constraint restricts `status` to `active`, `ended`, or `upcoming`.
* Indexes on `unit_id`, `tenant_id`, and `user_id` improve lookup performance.

### Payments (`payments`)

* Linked to `agreement_id`, `user_id`, `tenant_id`, and `unit_id`.
* All relations cascade on delete to prevent orphaned records.
* Stores:

  * `billing_month`
  * `amount_due`
  * `amount_paid` (default `0`)
  * `status` enum (`unpaid` default, `partial`, `paid`)
  * optional `payment_date`
  * optional `payment_method`
  * optional `notes`
  * timestamps

### Workspace Settings (`workspace_settings`)

* One-to-one relationship with users enforced via a unique `user_id`.
* Cascade delete on user removal.
* Stores workspace-level metadata:

  * `name` (default: `LandlordBD`)
  * `language` (default: `English`)
  * `timezone` (default: `Asia/Dhaka`)
  * `currency` (default: `BDT`)

### Personal Access Tokens (`personal_access_tokens`)

* Standard Laravel Sanctum table.
* Uses polymorphic `tokenable` ownership.
* Stores `token`, optional `abilities`, optional `expires_at`, and timestamps.
* No cascading beyond Laravel’s morph behavior.

## Relationships and Lifecycle

* **High-level flow**
  User → Buildings → Units → Tenants → Rental Agreements → Payments

* **Ownership scoping**
  All domain records are scoped to a landlord either directly (`user_id`) or indirectly through ownership chains (e.g., units via buildings).

* **Cascading deletes**

  * Deleting a user removes all owned data.
  * Deleting a building removes its units.
  * Deleting a unit or tenant removes related agreements and payments.

* **Agreement lifecycle**

  * Create building → add units → register tenant → start rental agreement → record payments.
  * Ending an agreement sets `status = ended` and optionally `end_date_actual`.
  * Once ended, a new agreement may be created for the same unit.

## Foreign Key Map

* `buildings.user_id` → `users.id` (cascade delete)
* `units.building_id` → `buildings.id` (cascade delete)
* `tenants.user_id` → `users.id` (cascade delete)
* `rental_agreements.user_id` → `users.id` (cascade delete)
* `rental_agreements.tenant_id` → `tenants.id` (cascade delete)
* `rental_agreements.unit_id` → `units.id` (cascade delete)
* `payments.agreement_id` → `rental_agreements.id` (cascade delete)
* `payments.user_id` → `users.id` (cascade delete)
* `payments.tenant_id` → `tenants.id` (cascade delete)
* `payments.unit_id` → `units.id` (cascade delete)
* `workspace_settings.user_id` → `users.id` (unique, cascade delete)