# Prompt History

This file was extracted from the Codex session history for the Inventory Management technical assessment.

## Prompt 1

```text
can you check on the backend if there's any javascript framework installed
```

## Prompt 2

```text
check if laravel boost has already been installed
```

## Prompt 3

```text
is api installed as well
```

## Prompt 4

```text
inside frontend, is shadcn components installed
```

## Prompt 5

```text
install shadcn components
```

## Prompt 6

```text
Read and follow the project instructions in:

- ./AGENTS.md
- ./backend/AGENTS.md
- ./frontend/AGENTS.md

Before making any changes, inspect the existing backend and frontend projects, their installed package versions, current structure, existing routes/components, and configuration.

Do not write or modify code yet.

Then summarize:

1. Your understanding of the Product CRUD application and its scope.
2. The current Laravel and Next.js project state.
3. Any existing code or configuration we can reuse.
4. Any blockers or missing setup.
5. A minimal implementation sequence for this 4-hour assessment.

The implementation must follow the AGENTS.md files. Keep the solution small and understandable. Do not add features or abstractions outside the agreed scope.

Plan to implement and verify the Laravel API first, then build the Next.js frontend only after the API works.
```

## Prompt 7

```text
Proceed with the backend Product CRUD implementation.

Follow ./AGENTS.md and ./backend/AGENTS.md.

Work only in the backend for now. Do not modify the frontend yet.

Implement the agreed Product resource:

- name: required string
- description: nullable text
- quantity: required integer, minimum 0
- price: required decimal, minimum 0
- status: active or inactive, default active

Implement:

GET    /api/products
GET    /api/products/{product}
POST   /api/products
PUT    /api/products/{product}
DELETE /api/products/{product}

Use PostgreSQL and normal Laravel conventions.

Before changing code, inspect the existing Laravel structure and installed versions. Use Laravel Boost and its documentation tools when required by the backend AGENTS.md.

Keep the implementation proportional to the assessment. Do not add authentication, API versioning, service/repository layers, stock transactions, pagination, or unrelated features.

Add focused Pest feature tests for the Product API.

After implementation:
- run the relevant migrations/tests
- run the required Laravel Pint command
- verify the Product routes
- report exactly what was changed and whether all verification passed

Stop after the backend is complete and verified. Do not start the frontend until I tell you to continue.
```

## Prompt 8

```text
just quick question. I noticed that in the controller, the queried data are not formed into json. I once developed a decoupled architecture in the past and that was how I did it
```

## Prompt 9

```text
is this a new way of writing controller functions
```

## Prompt 10

```text
great. I will test the api routes using postman. Create a seeder to fill atleast 5 products
```

## Prompt 11

```text
The Laravel Product API is now complete.

Proceed with the Next.js frontend.

Follow ./AGENTS.md and ./frontend/AGENTS.md. Read the locally installed Next.js documentation required by the generated Next.js agent instructions before relying on version-specific APIs.

Do not modify the Laravel backend unless you discover a genuine API contract problem. If you do, report it before changing backend code.

Build the /products screen using shadcn/ui.

Requirements:

- Display products in a table.
- Columns: Name, Description, Quantity, Price, Status, Actions.
- Add Product uses a Dialog.
- View uses a Dialog and calls GET /api/products/{product}.
- Edit uses a Dialog.
- Delete uses an AlertDialog with confirmation.
- Reuse the Product form for Create and Edit where practical.
- Display status using a Badge.
- Use a Select for active/inactive status.
- Use native fetch().
- Use NEXT_PUBLIC_API_URL for the Laravel API base URL.
- Display Laravel field validation errors in the form.
- Include loading, empty, request error, and submitting states.
- Refresh or update the product table after successful mutations.

Keep the frontend simple and understandable. Do not add React Query, Axios, Redux, Zustand, TanStack Table, pagination, advanced filtering, or unrelated dependencies.

After implementation, run the appropriate Next.js checks/build and report what was changed and whether verification passed.
```

## Prompt 12

```text
The Laravel Product API is now complete and verified.

Proceed with the Next.js frontend.

Follow:
- ./AGENTS.md
- ./frontend/AGENTS.md

Read the locally installed Next.js documentation required by the generated
Next.js agent instructions before relying on version-specific APIs.

## Separation of Responsibilities

Keep the frontend and backend strictly separated.

Next.js is responsible for:
- frontend routing
- UI/components
- the products table
- dialogs and forms
- calling the Laravel REST API
- loading and empty states
- displaying API and validation errors
- client-side interaction state

Laravel is responsible for:
- PostgreSQL/database persistence
- Eloquent models
- migrations
- backend validation
- business logic
- API routes
- JSON responses

Do not:
- access PostgreSQL directly from Next.js
- recreate backend validation/business logic as the source of truth
- add server-side database logic to the frontend
- use Inertia
- move Laravel responsibilities into Next.js

The frontend should communicate with Laravel only through the agreed HTTP/JSON API.

Do not modify the Laravel backend unless you discover a genuine API contract
problem. If you discover one, stop and report the problem before changing
backend code.

## Frontend Structure and Separation of Concerns

Preserve a clear separation between pages, components, hooks, API logic, types,
and utilities.

Prefer the existing `src/` structure when present.

A reasonable target structure is:

src/
├── app/
│   ├── page.tsx
│   └── products/
│       └── page.tsx
├── components/
│   ├── ui/
│   └── products/
│       ├── product-table.tsx
│       ├── product-form-dialog.tsx
│       ├── product-view-dialog.tsx
│       └── product-delete-dialog.tsx
├── hooks/
│   └── use-products.ts
├── lib/
│   └── api/
│       ├── client.ts
│       └── products.ts
├── types/
│   └── product.ts
└── utils/
    └── product.ts

Responsibilities:

- `app/` should contain routing and page composition.
- `components/ui/` should contain shadcn/ui primitives.
- `components/products/` should contain Product-specific UI components.
- `hooks/` should contain reusable React state and CRUD interaction logic.
- `lib/api/` should contain HTTP/fetch communication with the Laravel API.
- `types/` should contain shared TypeScript types and interfaces.
- `utils/` should contain pure formatting/transformation helpers.

Keep `app/products/page.tsx` thin. Do not implement the entire CRUD flow inside
the page component.

Do not place reusable API request logic directly inside presentation components.

Do not put React state inside `utils`.

Do not put HTTP requests inside `utils`.

Do not create unnecessary layers or a file for every small operation.

Use a small number of meaningful hooks, utilities, and API modules.

Follow the existing project structure if it differs, but preserve the same
separation of responsibilities.

## Products Screen

Build the main screen at:

/products

The root route / may redirect to /products.

Display products using a shadcn/ui Table.

Columns:
- Name
- Description
- Quantity
- Price
- Status
- Actions

## CRUD UI

Create:
- Add Product button opens a shadcn Dialog.
- Submit to POST /api/products.

View:
- Open a read-only Dialog.
- Call GET /api/products/{product}.
- Do not rely only on the data already present in the table row.

Edit:
- Open a Dialog populated with the existing product data.
- Submit to PUT /api/products/{product}.
- Reuse the Product form used by Create where practical.

Delete:
- Use a shadcn AlertDialog.
- Require confirmation.
- Submit to DELETE /api/products/{product}.

## Product Fields

Product:
- name: required string
- description: optional
- quantity: required integer >= 0
- price: required decimal >= 0
- status: active | inactive, default active

Use:
- Input for name
- Textarea for description
- numeric Input for quantity
- numeric Input with a sensible decimal step for price
- Select for status
- Badge for displaying status

Laravel remains the source of truth for validation.

When Laravel returns validation errors:
- keep the form dialog open
- display field errors near the appropriate inputs

## API Communication

Use native fetch().

Use:

NEXT_PUBLIC_API_URL=http://localhost:8000/api

Build requests from NEXT_PUBLIC_API_URL rather than hardcoding the Laravel URL
throughout components.

Do not add:
- Axios
- React Query / TanStack Query
- Redux
- Zustand
- TanStack Table
- another global state library

unless explicitly requested.

A small shared API layer under `lib/api/` is preferred so API communication is
kept separate from UI components.

## UI States

Include:
- initial loading state
- empty products state
- API request error state
- field-level Laravel validation errors
- disabled submit button while creating/updating
- disabled delete action while deleting
- loading state when viewing an individual product

After successful create, update, or delete:
- close the relevant dialog
- refresh or update the products table

Use existing shadcn-compatible toast/notification functionality if it is
already installed. Do not add a separate dependency just for notifications.

## Scope

Keep this implementation intentionally simple and understandable.

Do not add:
- authentication
- dashboards
- charts
- categories
- suppliers
- SKU management
- images
- stock movement features
- pagination
- advanced searching/filtering/sorting
- separate create/edit/detail pages
- unnecessary abstraction layers
- unrelated dependencies

Follow the existing project structure and conventions before creating new ones.

After implementation:
1. Run the appropriate Next.js checks.
2. Run a production build if appropriate.
3. Fix any errors introduced by the implementation.
4. Report the files changed.
5. Report what verification was performed and whether it passed.

Stop after the agreed Product CRUD frontend is complete. Do not add additional
features without asking first.
```

## Prompt 13

```text
Don't edit anything. How is the response message added? Example using the return response()->json(['message'=>'']).
```

## Prompt 14

```text
Read the Codex rollout session file for this project and create a clean PROMPT_HISTORY.md for assessment submission.

Include only the prompts/messages I sent to Codex that are related to this assessment.

Requirements:
- Preserve the original wording of each prompt.
- Keep them in chronological order.
- Exclude assistant responses, tool calls, system/internal messages, metadata, and reasoning.
- Exclude unrelated prompts from other projects if present.
- Redact any sensitive information such as passwords, API keys, tokens, credentials, or private URLs.
- Add a short note at the top stating that the file was extracted from the Codex session history.
- Do not summarize or improve the prompts.
```
