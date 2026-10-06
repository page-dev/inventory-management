# Product Management System

A simple product management application built using a decoupled Laravel backend and Next.js frontend. The system allows users to manage product records through the frontend interface, while the backend handles validation, application logic, and database operations through a REST API.

## Running the Project

The frontend and backend are separate applications and must be run independently.

### 1. Backend — Laravel

Navigate to the Laravel backend directory:

```bash
cd backend
```

Install the PHP dependencies:

```bash
composer install
```

Create the environment configuration:

```bash
cp .env.example .env
```

Generate the Laravel application key:

```bash
php artisan key:generate
```

Configure the database connection inside the `.env` file.

Run the database migrations:

```bash
php artisan migrate
```

Run the database seeder to populate the application with initial data:

```bash
php artisan db:seed
```

Alternatively, the migrations and seeders can be run together using:

```bash
php artisan migrate --seed
```

Start the Laravel development server:

```bash
php artisan serve
```

By default, the backend should be available at:

```text
http://127.0.0.1:8000
```

### 2. Frontend — Next.js

Navigate to the Next.js frontend directory:

```bash
cd frontend
```

Install the required dependencies:

```bash
npm install
```

Configure the frontend environment variables so that the application points to the Laravel API.

For example:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
```

Start the Next.js development server:

```bash
npm run dev
```

By default, the frontend should be available at:

```text
http://localhost:3000
```

## Architecture and Implementation

The application uses a decoupled architecture in which the Laravel backend and Next.js frontend operate as separate applications and communicate through HTTP requests using JSON.

The Laravel backend is responsible for server-side concerns such as request validation, application logic, database operations, and API responses. This keeps important rules and data handling centralized on the server instead of relying on the frontend.

The Next.js frontend is responsible for presentation, user interaction, and client-side state. Its structure separates user interface concerns from API communication and state management, allowing each part of the frontend to focus on a specific responsibility.

The architecture was chosen to maintain separation of concerns and reduce unnecessary coupling between different parts of the application. It also makes the codebase easier to understand, maintain, test, and extend, since frontend and backend changes can be handled independently as long as the API contract remains consistent.

## AI Tools Used

The AI tool used for implementation was mainly Codex. Before development began,
I first used ChatGPT to discuss and finalize the system design, including the
application scope, Product specification, frontend behavior, and the separation
between the Laravel backend and Next.js frontend.

After the design was finalized, I asked ChatGPT to extract the agreed project
context and incorporate it into the project's `AGENTS.md` files. These files
provided Codex with persistent instructions about the architecture, scope,
coding constraints, and framework-specific responsibilities before it started
working on the code.

This setup helped reduce incorrect assumptions and kept Codex aligned with the
agreed design.

One thing the AI initially got wrong happened during the planning stage. When I
asked about separation of responsibilities in the frontend, ChatGPT interpreted
this as the separation between the frontend and backend. What I actually meant
was the frontend code structure: keeping components, hooks, types, utilities,
and API logic in separate directories in which how I always structured my react code.

I corrected that requirement before implementation and updated the frontend
instructions accordingly. This ensured that Codex followed the project structure
I normally use rather than placing most of the CRUD logic inside a single page
component.

## AI Setup

The AI setup for this assessment was kept simple and focused on giving the coding agent enough context to work consistently across both the backend and frontend.

### Prompt History

The prompts used during the assessment were saved separately in:

`PROMPT_HISTORY.md`

The prompt history includes the main instructions used for:

- backend implementation
- frontend implementation
- validation and testing
- follow-up fixes and adjustments

This provides a record of how the application was developed with AI assistance.

### Skills

The backend uses framework-specific skills generated as part of the Laravel setup.

These skills provide additional guidance for tasks such as:

- Laravel development
- testing
- framework conventions
- package-specific behavior

The agent is instructed to use the relevant skill whenever working in an area covered by those instructions.

### Context

Project context is stored in `AGENTS.md` files so the AI does not need to be given the full project requirements repeatedly.

The structure is:

```text
AGENTS.md
backend/AGENTS.md
frontend/AGENTS.md
