const express = require('express');
const cors = require('cors');
const pool = require('./db');
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

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, text, date, priority, done, in_my_day as "inMyDay" FROM notes ORDER BY date DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create note
app.post('/api/notes', async (req, res) => {
  const { text, date, priority } = req.body;

  if (!text || !date || !priority) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO notes (text, date, priority) VALUES ($1, $2, $3) RETURNING id, text, date, priority, done, in_my_day as "inMyDay"',
      [text, date, priority]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Update note
app.put('/api/notes/:id', async (req, res) => {
  const { id } = req.params;
  const { text, done, inMyDay } = req.body;

  try {
    const result = await pool.query(
      'UPDATE notes SET text = COALESCE($1, text), done = COALESCE($2, done), in_my_day = COALESCE($3, in_my_day), updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING id, text, date, priority, done, in_my_day as "inMyDay"',
      [text || null, done !== undefined ? done : null, inMyDay !== undefined ? inMyDay : null, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update note' });
  }
});

// Delete note
app.delete('/api/notes/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM notes WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

app.listen(PORT, () => {
  console.log(`DEWIT Backend running on port ${PORT}`);
});
