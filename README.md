# Portify

**Project Management Portal**

Portify is a Laravel-based project management portal that lets admins manage projects, files, and direct messaging for their clients. Users get a personal dashboard showing only the projects and files assigned to them, with real-time notifications and a built-in chat system.

---

## Design

Figma Mockups:
https://www.figma.com/design/BIfSvF3uxD8ZUQ5rBPCeoa/Portify?t=pqa40VN0TTKI5x5Z-1

---

## Tech Stack

* **Backend:** Laravel 12, PHP 8.2+
* **Frontend:** React 19, TypeScript, Inertia.js, Tailwind CSS 4, Vite
* **Database:** MySQL
* **Auth:** Laravel Fortify (with 2FA & Google OAuth)
* **Messaging:** musonza/chat
* **UI Components:** Radix UI, Lucide icons
* **Package Managers:** Composer (PHP), npm (Node.js)

---

## System Requirements

Make sure you have the following installed:

| Tool | Version | Check |
|------|---------|-------|
| PHP | 8.2+ | `php -v` |
| Composer | 2.x | `composer -V` |
| Node.js | 18+ | `node -v` |
| npm | 9+ | `npm -v` |
| MySQL | 8.0+ | `mysql --version` |

### Required PHP Extensions

OpenSSL, PDO, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, Fileinfo, cURL

---

## Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Portify.git
cd Portify
```

### 2. Install dependencies

```bash
composer install
npm install
```

### 3. Configure environment

Copy the example env file and fill in your database credentials:

```bash
cp .env.example .env
```

Update the following in `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portify
DB_USERNAME=root
DB_PASSWORD=
```

### 4. Generate application key

```bash
php artisan key:generate
```

### 5. Create a storage symlink

This makes uploaded files (project logos, documents) accessible from the browser:

```bash
php artisan storage:link
```

### 6. Run database migrations

```bash
php artisan migrate
```

Optionally seed the database with test data:

```bash
php artisan db:seed
```

---

## Running the Project

The easiest way to start all services at once:

```bash
composer dev
```

This runs the Laravel server, queue worker, and Vite dev server concurrently.

Alternatively, start them separately in different terminals:

```bash
# Terminal 1 — Laravel backend
php artisan serve

# Terminal 2 — Vite frontend
npm run dev
```

The application will be available at: **http://localhost:8000**

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `composer dev` | Start all dev servers (Laravel + Vite + queue) |
| `composer setup` | Full setup (install, key, migrate, build) |
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build frontend for production |
| `npm run lint` | Run ESLint with auto-fix |
| `npm run types` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |
| `php artisan test` | Run Pest test suite |

---

## Project Structure

```
app/
├── Http/Controllers/       # API & page controllers
├── Models/                 # Eloquent models
resources/js/
├── components/             # Reusable React components
│   ├── admin/              # Admin-specific components
│   ├── messages/           # Chat & messaging UI
│   ├── user/               # User dashboard components
│   └── ui/                 # Shared UI primitives (Button, Dialog, etc.)
├── contexts/               # React context providers
├── layouts/                # Page layout wrappers
├── pages/                  # Inertia page components
│   ├── admin/              # Admin pages
│   ├── auth/               # Authentication pages
│   └── settings/           # Settings pages
└── types/                  # TypeScript type definitions
routes/
├── web.php                 # Page routes
└── settings.php            # API & settings routes
```

---

## Features

* **Admin Dashboard** — Create, edit, and delete projects and files, assign them to users
* **User Dashboard** — View only assigned projects and files with deadline tracking
* **Messaging** — Direct chat between users with emoji reactions, replies, edit, and delete
* **Notifications** — Automatic notifications when projects/files are created, updated, or deleted, and when new messages arrive
* **Authentication** — Login, register, email verification, password reset, two-factor authentication, Google OAuth
* **File Management** — Upload, download, and manage documents per user

---

## Development Notes

* Ensure MySQL is running before starting the application.
* Keep `npm run dev` (or `composer dev`) running while developing — Vite handles hot module replacement.
* Never commit the `.env` file — it contains secrets.
* Uploaded files are stored in `storage/app/public/` and served via the `/storage` symlink.
