<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project-Specific Frontend Instructions

These rules define the frontend behavior for this technical assessment.

Keep the generated Next.js agent-rules block above intact.

## Frontend Responsibility

This Next.js application is the UI for a separate Laravel REST API.

Next.js owns:

- frontend routing
- product table UI
- forms and dialogs
- API consumption
- loading states
- empty states
- user-facing validation and API error messages

Laravel owns:

- database persistence
- backend validation
- business logic
- API routes
- JSON responses

Do not use Inertia.

Do not add backend/database logic to the Next.js application.

## UI Library

Use shadcn/ui components.

Prefer the existing installed shadcn components before adding new ones.

Likely components for this Product CRUD:

- `Table`
- `Button`
- `Dialog`
- `AlertDialog`
- `DropdownMenu`
- `Input`
- `Textarea`
- `Label`
- `Select`
- `Badge`

Do not install large component sets or unrelated UI packages.

Use a normal shadcn `Table`. Do not introduce TanStack Table, advanced filtering, column visibility, sorting, or pagination unless explicitly requested later.

## Products Screen

The main application screen is:

```text
/products
```

The root route `/` may redirect to `/products`.

Keep CRUD interactions on the Products screen rather than creating separate create/edit/detail pages.

The products table displays:

- Name
- Description
- Quantity
- Price
- Status
- Actions

Use a `Badge` for `active` / `inactive` status when practical.

## CRUD Interaction Design

### Create

- `Add Product` opens a shadcn `Dialog`.
- Use the shared product form.
- Submit to `POST /api/products`.
- Keep the dialog open if validation fails.
- Show Laravel field validation errors near the related fields.
- Disable the submit action while the request is in progress.
- On success, close the dialog and refresh/update the product list.

### View

- `View` opens a read-only shadcn `Dialog`.
- Fetch the product from `GET /api/products/{product}`.
- Do not rely only on the row data; exercise the backend `show` endpoint.
- Show a loading state while the product is being fetched.
- Show a clear error state if the request fails.

### Edit

- `Edit` opens a shadcn `Dialog`.
- Pre-populate the shared product form with the current product values.
- Submit to `PUT /api/products/{product}`.
- Keep the dialog open if validation fails.
- Show field validation errors.
- Disable the submit action while saving.
- On success, close the dialog and refresh/update the product list.

### Delete

- `Delete` must open a shadcn `AlertDialog`.
- Require explicit confirmation before sending the delete request.
- Submit to `DELETE /api/products/{product}`.
- Disable the destructive action while deleting.
- On success, close the dialog and refresh/update the product list.

## Product Form

The form contains:

- `name`
  - text input
  - required
- `description`
  - textarea
  - optional
- `quantity`
  - numeric input
  - integer
  - minimum `0`
- `price`
  - numeric input
  - minimum `0`
  - use a sensible decimal step such as `0.01`
- `status`
  - shadcn `Select`
  - values: `active`, `inactive`
  - default: `active` for new products

Client-side constraints may improve UX, but Laravel validation remains the source of truth.

Do not create a separate stock status field. If a future UI needs in-stock/out-of-stock information, derive it from `quantity`.

## API Communication

Use the native `fetch()` API.

Do not add Axios, React Query/TanStack Query, Redux, Zustand, or another data/state library for this CRUD unless explicitly requested.

Use:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Build requests from `NEXT_PUBLIC_API_URL` rather than hardcoding the backend URL throughout components.

Keep API access straightforward. A small shared API helper is acceptable, but do not create repository/service layers or excessive abstractions.

## Suggested Frontend Structure

Prefer a small, understandable structure that follows the existing application conventions.

A reasonable target is:

```text
app/
  products/
    page.tsx

components/
  products/
    product-table.tsx
    product-form-dialog.tsx
    product-view-dialog.tsx
    product-delete-dialog.tsx

lib/
  api.ts

types/
  product.ts
```

This is guidance, not a requirement. Follow the existing project structure and Next.js version-specific conventions first.

Reuse one product form implementation for both Create and Edit where practical.

## States and Feedback

The Products experience should include:

- initial loading state
- empty state when there are no products
- API error state
- field-level Laravel validation errors
- disabled submit/delete actions while requests are running
- delete confirmation

If an existing shadcn-compatible toast/notification component is already available, it may be used for success/error feedback. Do not add a new notification dependency solely for this assessment if simpler feedback is sufficient.

## Scope Control

Do not add these unless explicitly requested:

- authentication
- dashboards
- charts
- categories
- suppliers
- SKU management
- product images
- stock movement UI
- advanced search
- advanced sorting/filtering
- pagination
- separate create/edit/detail routes
- global state management
- unnecessary third-party dependencies

Favor readable components and direct data flow over abstraction.

The candidate should be able to explain how the page fetches products, how each modal works, how Laravel validation errors are displayed, and how CRUD requests update the UI.
