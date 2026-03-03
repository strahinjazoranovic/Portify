# Portify

**Project Management Portal**

Portify is a Laravel-based project management portal designed to help teams manage projects, tasks, and workflows efficiently.

---

## Design

Figma Mockups:
https://www.figma.com/design/BIfSvF3uxD8ZUQ5rBPCeoa/Portify?t=pqa40VN0TTKI5x5Z-1

---

# Tech Stack

* **Backend:** Laravel
* **Frontend:** Vite + npm
* **Database:** MySQL
* **Package Managers:** Composer (PHP), npm (Node)

---

# System Requirements

Before running the project, make sure you have the following installed:

## 1. PHP

* **PHP 8.1 or higher** (recommended for modern Laravel versions)

Check your version:

```bash
php -v
```

### Required PHP Extensions

Make sure the following extensions are enabled:

* OpenSSL
* PDO
* Mbstring
* Tokenizer
* XML
* Ctype
* JSON
* BCMath
* Fileinfo
* cURL

---

## 2. Composer (PHP Package Manager)

Laravel depends on Composer to manage backend dependencies.

Check if installed:

```bash
composer -V
```

Download if needed:
https://getcomposer.org/download/

---

## 3. Node.js & npm

* **Node.js v16 or higher recommended**
* npm (comes with Node.js)

Check with:

```bash
node -v
npm -v
```

Download Node.js:
https://nodejs.org/en/download/current

---

## 4. Database

Install and run one of the following:

* MySQL (recommended)
* MariaDB
* PostgreSQL
* SQLite

Make sure your database server is running and update your `.env` file:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=portify
DB_USERNAME=root
DB_PASSWORD=
```

---

# ⚙️ Project Setup

After cloning the repository:

```bash
git clone <your-repository-url>
cd portify
```

---

## 1. Install PHP Dependencies

```bash
composer install
```

---

## 2. Install JavaScript Dependencies

```bash
npm install
```

---

## 3. Configure Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Update database credentials inside `.env`.

---

## 4. Generate Application Key

```bash
php artisan key:generate
```

---

## 5. Run Database Migrations

```bash
php artisan migrate
```

(Optional if the project uses seeders:)

```bash
php artisan db:seed
```

---

# Running the Project Locally

Start the Laravel development server:

```bash
php artisan serve
```

Start the frontend development server:

```bash
npm run dev
```

The application should now be available at:

```
http://127.0.0.1:8000
```

---

# Development Notes

* Ensure your database server is running before starting Laravel.
* Keep `npm run dev` running while developing frontend changes.
* Use `.env` for environment-specific configurations.
* Never commit your `.env` file to version control.

---