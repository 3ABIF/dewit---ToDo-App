# dewit! – Todo App

A modern, responsive todo/note-taking application with user authentication, priority levels, and a "My Day" focus feature.

## Architecture

```
Frontend (Nginx + Vanilla JS) ←→ Backend (Express.js) ←→ Database (PostgreSQL)
```

- **Frontend**: Vanilla JS, CSS, HTML — no build step, served by Nginx
- **Backend**: Node.js, Express.js, JWT auth (bcrypt + jsonwebtoken)
- **Database**: PostgreSQL 15
- **Deployment**: Docker Compose, Nginx reverse proxy

## Quick Start

```bash
docker-compose up
```

The app will be available at `http://localhost`:
- **Frontend**: http://localhost (Nginx, port 80)
- **Backend API**: http://localhost:3001 (Express)
- **Database**: PostgreSQL on port 5432

## Local Development

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev   # with nodemon
# or
npm start     # production
```

### Frontend

No build step required. Open `index.html` in a browser or use a local server.
Update `API_URL` in `script-api.js` if your backend runs on a different host.

For offline development without a backend, switch `index.html` to load `script.js` instead of `script-api.js`.

## Features

- User authentication (register/login/logout with JWT)
- Create, read, update, delete notes
- Priority levels: Important, Medium, Low
- "My Day" focus section for today's tasks
- Search and filter notes
- Calendar view with priority indicators
- Dark mode
- Responsive design
- Toast notifications for all actions
- Inline editing

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/verify` | Verify token | Yes |
| GET | `/api/notes` | Fetch all notes | Yes |
| POST | `/api/notes` | Create note | Yes |
| PUT | `/api/notes/:id` | Update note | Yes |
| DELETE | `/api/notes/:id` | Delete note | Yes |

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

## Deployment

### Portainer

1. Push repository to GitHub
2. In Portainer: **Stacks** → **Add Stack**
3. Paste the root `docker-compose.yml`
4. Set environment variables (especially `JWT_SECRET`)
5. Deploy

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `DB_USER` | PostgreSQL username | Yes |
| `DB_HOST` | PostgreSQL host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_PASSWORD` | PostgreSQL password | Yes |
| `DB_PORT` | PostgreSQL port | Yes |
| `PORT` | Backend server port | No (default: 3001) |

## Project Structure

```
├── Frontend
│   ├── index.html          # Main app page
│   ├── index-login.html    # Login/registration page
│   ├── script-api.js       # API client (production)
│   ├── script.js           # LocalStorage fallback (offline dev)
│   └── style.css           # Styles
│
├── Backend (backend/)
│   ├── server.js           # Express REST API
│   ├── auth.js             # JWT authentication
│   ├── db.js               # PostgreSQL connection pool
│   ├── schema.sql          # Database schema
│   └── package.json        # Dependencies
│
├── Docker
│   ├── Dockerfile          # Frontend (Nginx)
│   ├── backend/Dockerfile  # Backend (Node.js)
│   ├── docker-compose.yml  # Full stack
│   ├── backend/docker-compose.yml  # Backend + DB only
│   └── nginx.conf          # Nginx reverse proxy
│
└── Documentation
    ├── SETUP.md             # Setup guide
    └── Project_Definition_Document.md  # Project specs
```

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS, HTML
- **Backend**: Node.js, Express.js, PostgreSQL (pg driver)
- **Auth**: JWT (jsonwebtoken), bcrypt
- **Database**: PostgreSQL 15
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx

## Authors

- Johannes Pernsteiner
- Robin Steininger
