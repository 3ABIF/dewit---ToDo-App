# DEWIT Backend

Express.js backend for the DEWIT Todo App with PostgreSQL database.

## Setup

### Local Development

1. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Database Setup**
   Create a PostgreSQL database and run the schema:
   ```bash
   psql -U postgres -d dewit -f schema.sql
   ```

4. **Start Server**
   ```bash
   npm run dev  # with nodemon
   # or
   npm start    # production
   ```

Server runs on `http://localhost:3001`

### Docker

Start all services (PostgreSQL + Backend + Frontend):
```bash
cd ..  # go to root
docker-compose up
```

Access at `http://localhost`

## API Endpoints

### Get all notes
```
GET /api/notes
```

### Create note
```
POST /api/notes
Body: { text, date, priority }
```

### Update note
```
PUT /api/notes/:id
Body: { text?, done?, inMyDay? }
```

### Delete note
```
DELETE /api/notes/:id
```

## Environment Variables

See `.env.example` for all configuration options.
