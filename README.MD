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

This separation creates a clear boundary between the frontend and backend. The frontend consumes the API without needing direct knowledge of the database, while the backend remains independent of how the user interface is implemented.

The architecture was chosen to maintain separation of concerns and reduce unnecessary coupling between different parts of the application. It also makes the codebase easier to understand, maintain, test, and extend, since frontend and backend changes can be handled independently as long as the API contract remains consistent.