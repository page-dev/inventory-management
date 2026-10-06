# Inventory Management Technical Assessment

## Project Context

This repository contains a time-boxed full-stack technical assessment.

The application is a small Product Management CRUD system with a simple inventory quantity field.

Architecture:

```text
Next.js frontend
    ↓ HTTP / JSON
Laravel REST API
    ↓
PostgreSQL
```

The priority is a complete, readable, working implementation that can be clearly explained during a follow-up interview.

Favor the smallest correct implementation. Do not overengineer.

## Repository Boundaries

- `backend/` is the Laravel REST API.
- `frontend/` is the Next.js application.
- Laravel and Next.js are separate applications that communicate over HTTP using JSON.
- Do not use Inertia.
- Keep backend and frontend responsibilities separate.

## Product Specification

The primary resource is `Product`.

Fields:

- `id`
- `name`
  - required
  - string
- `description`
  - optional
  - text
- `quantity`
  - required
  - integer
  - minimum `0`
- `price`
  - required
  - decimal
  - minimum `0`
  - store with two decimal places
- `status`
  - required
  - allowed values: `active`, `inactive`
  - default: `active`
- `created_at`
- `updated_at`

Do not store `in_stock` or `out_of_stock` as the product status. Stock availability can be derived from `quantity` if needed later:

```text
quantity > 0  → in stock
quantity = 0  → out of stock
```

For this assessment, `quantity` is edited directly on the product. Do not add stock movement, stock-in, stock-out, or inventory transaction tables unless explicitly requested later.

## Required CRUD Behavior

The application must support:

- List products
- View a product
- Create a product
- Update a product
- Delete a product

Expected API endpoints:

```http
GET    /api/products
GET    /api/products/{product}
POST   /api/products
PUT    /api/products/{product}
DELETE /api/products/{product}
```

Do not introduce API versioning for this assessment unless explicitly requested.

## Frontend Experience

The primary frontend screen is `/products`.

The products are displayed in a table with these columns:

- Name
- Description
- Quantity
- Price
- Status
- Actions

CRUD interactions should stay on the products screen:

- Create → modal/dialog
- View → modal/dialog
- Edit → modal/dialog
- Delete → confirmation alert dialog

Use the dedicated `GET /api/products/{product}` endpoint for the View action so the `show` endpoint is exercised.

The root route `/` may redirect to `/products`.

## Assessment Priorities

Prioritize work in this order:

1. Working CRUD
2. Correct backend validation and API behavior
3. Correct frontend/backend integration
4. Clear loading, empty, validation, and error states
5. Delete confirmation
6. Basic polished styling
7. Focused testing
8. README/final cleanup if time remains

## Out of Scope

Do not add these unless explicitly requested:

- authentication
- authorization or roles
- dashboards
- audit logs
- email
- queues
- events/listeners for simple CRUD
- Docker
- hosted database services
- categories
- suppliers
- product images
- SKU management
- stock movement history
- advanced search
- advanced sorting
- pagination
- complex business rules
- repository patterns
- unnecessary service layers
- global state libraries
- unnecessary third-party dependencies

## Working Principles

- Follow existing project conventions before introducing new ones.
- Do not silently change the agreed Product schema or API contract.
- Prefer framework-native features over additional packages.
- Prefer straightforward code over clever abstractions.
- Keep changes proportional to a four-hour assessment.
- Reuse existing components and patterns where practical.
- Keep code understandable enough to explain during an interview.
- Do not create extra architecture simply for future possibilities.
- New features may be added later only after the core CRUD is complete.
