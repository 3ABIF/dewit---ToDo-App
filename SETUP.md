# DEWIT – Todo App

A modern, responsive todo/note-taking application with a backend API and database.

## Architecture

```
├── Frontend (Nginx + Vanilla JS)
│   ├── index.html
│   ├── style.css
│   └── script-api.js (API client)
│
├── Backend (Express.js)
│   ├── server.js (REST API)
│   ├── db.js (PostgreSQL connection)
│   └── schema.sql (Database schema)
│
└── Database (PostgreSQL)
```

## Quick Start with Docker

**Fastest way to run everything:**

```bash
docker-compose up
```

This starts:
- **Frontend**: http://localhost (Nginx)
- **Backend**: http://localhost:3001 (Express API)
- **Database**: PostgreSQL on port 5432

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
# Update API_URL in script-api.js if needed
# Open index.html in your browser or use Live Server
```

## Features

- ✅ Create, read, update, delete notes
- 📅 Date-based organization
- 🎯 Priority levels (Important, Medium, Low)
- ⭐ "My Day" section for today's tasks
- 🔍 Search and filter notes
- 🌙 Dark mode support
- 📱 Responsive design

## Database Schema

```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  text VARCHAR(500),
  date DATE,
  priority VARCHAR(20), -- 'important', 'medium', 'low'
  done BOOLEAN,
  in_my_day BOOLEAN,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notes` | Fetch all notes |
| POST | `/api/notes` | Create new note |
| PUT | `/api/notes/:id` | Update note |
| DELETE | `/api/notes/:id` | Delete note |

## Deployment to Portainer

1. Push your repository to GitHub
2. In Portainer:
   - Go to **Stacks** → **Add Stack**
   - Paste the root `docker-compose.yml`
   - Set environment variables if needed
   - Deploy

The app will be accessible via Nginx on port 80.

## Next Steps

- [ ] Add user authentication
- [ ] Add recurring tasks
- [ ] Add task categories/tags
- [ ] Implement reminders/notifications
- [ ] Add collaborative features

## Tech Stack

- **Frontend**: Vanilla JavaScript, CSS, HTML
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **Web Server**: Nginx

## Notes

- Dark mode preference is stored in localStorage
- All note data is synced with the backend
- Backend is single-user by default (can be extended)
