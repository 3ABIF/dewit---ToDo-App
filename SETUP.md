# DEWIT – Todo App

A modern, responsive todo/note-taking application with user authentication, backend API and database.

## Architecture

```
├── Frontend (Nginx + Vanilla JS)
│   ├── index.html              # Main app page
│   ├── index-login.html        # Login/registration page
│   ├── style.css               # Styles + dark mode + toast notifications
│   ├── script-api.js           # API client (production, default)
│   └── script.js               # LocalStorage fallback (offline dev)
│
├── Backend (Express.js)
│   ├── server.js               # REST API + auth endpoints
│   ├── auth.js                 # JWT middleware + bcrypt password hashing
│   ├── db.js                   # PostgreSQL connection pool
│   └── schema.sql              # Database schema (users + notes tables)
│
└── Database (PostgreSQL 15)
```

## Quick Start with Docker

**Fastest way to run everything:**

```bash
docker-compose up
```

This starts:
- **Frontend**: http://localhost (Nginx, port 80)
- **Backend**: http://localhost:3001 (Express API)
- **Database**: PostgreSQL on port 5432

Nginx proxies `/api/` and `/auth/` requests to the backend. All other requests serve static files.

## Local Development

### Backend Setup

```bash
cd backend

# Copy environment config
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend API: `http://localhost:3001`

### Frontend Setup

For local frontend development without Docker:

```bash
# Update API_URL in script-api.js to 'http://localhost:3001/api' and AUTH_URL to 'http://localhost:3001/auth'
# Open index.html in your browser or use Live Server
```

### Offline Mode (No Backend)

To develop without a backend, switch `index.html` to load `script.js` instead of `script-api.js`. This stores all data in localStorage.

## Features

- User authentication (register/login/logout with JWT tokens)
- Create, read, update, delete notes
- Date-based organization
- Priority levels (Important, Medium, Low)
- "My Day" section for today's tasks
- Search and filter notes
- Dark mode support
- Responsive design
- Toast notifications for all actions
- Inline editing of notes

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('important', 'medium', 'low')),
  done BOOLEAN DEFAULT FALSE,
  in_my_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/verify` | Verify JWT token | Yes |

### Notes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/notes` | Fetch all notes for current user | Yes |
| POST | `/api/notes` | Create new note | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |

### Authentication

All protected endpoints require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

## Deployment to Portainer

1. Push your repository to GitHub
2. In Portainer:
   - Go to **Stacks** → **Add Stack**
   - Paste the root `docker-compose.yml`
   - Set environment variables:
     - `JWT_SECRET` (required, use a long random string)
     - `POSTGRES_PASSWORD` (change from default)
   - Deploy

The app will be accessible via Nginx on port 80.

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS, HTML
- **Backend**: Node.js, Express.js, JWT (jsonwebtoken), bcrypt
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx

## Notes

- Dark mode preference is stored in localStorage
- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt (salt rounds: 10)
- Each user has their own isolated notes
- `script.js` is kept as an offline development fallback (localStorage-based)
- Toast notifications auto-dismiss after 3 seconds
- Inline editing replaces the old `prompt()`-based editing
