const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { verifyToken, generateToken, hashPassword, comparePassword } = require('./auth');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ AUTHENTICATION ENDPOINTS ============

// Register
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Passwort muss mindestens 6 Zeichen lang sein' });
  }

  try {
    // Check if user already exists
    const userExists = await pool.query('SELECT id FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Benutzer oder Email bereits vorhanden' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    const user = result.rows[0];
    const token = generateToken(user.id, user.username);

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registrierung fehlgeschlagen' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email und Passwort erforderlich' });
  }

  try {
    // Find user
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const user = result.rows[0];

    // Compare password
    const passwordValid = await comparePassword(password, user.password_hash);
    if (!passwordValid) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // Generate token
    const token = generateToken(user.id, user.username);

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Anmeldung fehlgeschlagen' });
  }
});

// Verify token
app.get('/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true, userId: req.userId, username: req.username });
});

// ============ NOTES ENDPOINTS (Protected) ============

// Get all notes for current user
app.get('/api/notes', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, text, date, priority, done, in_my_day as "inMyDay" FROM notes WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notizen konnten nicht abgerufen werden' });
  }
});

// Create note
app.post('/api/notes', verifyToken, async (req, res) => {
  const { text, date, priority } = req.body;

  if (!text || !date || !priority) {
    return res.status(400).json({ error: 'Erforderliche Felder fehlen' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, text, date, priority) VALUES ($1, $2, $3, $4) RETURNING id, text, date, priority, done, in_my_day as "inMyDay"',
      [req.userId, text, date, priority]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notiz konnte nicht erstellt werden' });
  }
});

// Update note
app.put('/api/notes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { text, done, inMyDay } = req.body;

  try {
    const result = await pool.query(
      'UPDATE notes SET text = COALESCE($1, text), done = COALESCE($2, done), in_my_day = COALESCE($3, in_my_day), updated_at = CURRENT_TIMESTAMP WHERE id = $4 AND user_id = $5 RETURNING id, text, date, priority, done, in_my_day as "inMyDay"',
      [text || null, done !== undefined ? done : null, inMyDay !== undefined ? inMyDay : null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notiz nicht gefunden' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notiz konnte nicht aktualisiert werden' });
  }
});

// Delete note
app.delete('/api/notes/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notiz nicht gefunden' });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Notiz konnte nicht gelöscht werden' });
  }
});

app.listen(PORT, () => {
  console.log(`DEWIT Backend läuft auf Port ${PORT}`);
});