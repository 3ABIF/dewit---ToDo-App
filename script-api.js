const API_URL = 'http://localhost:3001/api';

let notes = [];

async function fetchNotes() {
  try {
    const response = await fetch(`${API_URL}/notes`);
    if (!response.ok) throw new Error('Failed to fetch notes');
    notes = await response.json();
    renderNotes();
    renderMyDay();
    renderCalendar();
  } catch (err) {
    console.error('Error fetching notes:', err);
    alert('Failed to load notes');
  }
}

async function addNote() {
  const text = textEl.value;
  const date = dateEl.value;
  const priority = priorityEl.value;

  if (!text || !date) return alert('Bitte Text und Datum eingeben');

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, date, priority })
    });
    if (!response.ok) throw new Error('Failed to create note');
    
    await fetchNotes();
    textEl.value = '';
    dateEl.value = '';
  } catch (err) {
    console.error('Error adding note:', err);
    alert('Failed to create note');
  }
}

async function deleteNote(i) {
  if (!confirm('Notiz löschen?')) return;
  
  try {
    const response = await fetch(`${API_URL}/notes/${notes[i].id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete note');
    
    await fetchNotes();
  } catch (err) {
    console.error('Error deleting note:', err);
    alert('Failed to delete note');
  }
}

async function editNote(i) {
  const t = prompt('Notiz bearbeiten', notes[i].text);
  if (t !== null) {
    try {
      const response = await fetch(`${API_URL}/notes/${notes[i].id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: t })
      });
      if (!response.ok) throw new Error('Failed to update note');
      
      await fetchNotes();
    } catch (err) {
      console.error('Error editing note:', err);
      alert('Failed to edit note');
    }
  }
}

async function toggleDone(i) {
  try {
    const response = await fetch(`${API_URL}/notes/${notes[i].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done: !notes[i].done })
    });
    if (!response.ok) throw new Error('Failed to update note');
    
    await fetchNotes();
  } catch (err) {
    console.error('Error toggling done:', err);
    alert('Failed to update note');
  }
}

async function toggleMyDay(i) {
  try {
    const response = await fetch(`${API_URL}/notes/${notes[i].id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inMyDay: !notes[i].inMyDay })
    });
    if (!response.ok) throw new Error('Failed to update note');
    
    await fetchNotes();
  } catch (err) {
    console.error('Error toggling My Day:', err);
    alert('Failed to update note');
  }
}

function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function daysLeft(date) {
  const today = new Date();
  today.setHours(0,0,0,0);
  return Math.ceil((new Date(date) - today) / 86400000);
}

function renderMyDay() {
  const myDayContainer = document.getElementById('myDayContainer');
  const myDayEmpty = document.getElementById('myDayEmpty');
  const myDayCount = document.getElementById('myDayCount');

  myDayContainer.innerHTML = '';

  const today = getToday();

  const myDayNotes = notes.filter(n =>
    n.date === today && n.inMyDay === true
  );

  const count = myDayNotes.length;
  myDayCount.textContent = count === 1
    ? '1 Notiz'
    : `${count} Notizen`;

  if (myDayNotes.length === 0) {
    myDayEmpty.style.display = 'block';
    myDayContainer.style.display = 'none';
    return;
  }

  myDayEmpty.style.display = 'none';
  myDayContainer.style.display = 'flex';

  myDayNotes.forEach(myDayNote => {
    const originalIndex = notes.findIndex(n => n === myDayNote);

    const div = document.createElement('div');
    div.className = `note ${myDayNote.priority}`;

    const days = daysLeft(myDayNote.date);

    div.innerHTML = `
      <div style="flex: 1;">
        <p class="${myDayNote.done ? 'done' : ''}">${myDayNote.text}</p>
        <div class="meta">📅 Heute · ${days >= 0 ? days + ' Tage übrig' : 'Abgelaufen'}</div>
      </div>
      <button onclick="toggleDone(${originalIndex})">✔️</button>
      <button class="secondary" onclick="editNote(${originalIndex})">✏️</button>
      <button class="my-day-btn" onclick="toggleMyDay(${originalIndex})">✕ Entfernen</button>
    `;
    myDayContainer.appendChild(div);
  });
}

function renderNotes() {
  const container = document.getElementById('notes');
  container.innerHTML = '';

  const search = searchEl.value.toLowerCase();
  const filter = filterEl.value;

  let list = notes.filter(n => n.text.toLowerCase().includes(search));

  if (filter === 'open') list = list.filter(n => !n.done);
  if (filter === 'done') list = list.filter(n => n.done);
  if (['important','medium','low'].includes(filter))
    list = list.filter(n => n.priority === filter);

  list.forEach((note) => {
    const originalIndex = notes.findIndex(n => n === note);
    const div = document.createElement('div');
    div.className = `note ${note.priority}`;

    const days = daysLeft(note.date);
    const today = getToday();
    const isToday = note.date === today;

    div.innerHTML = `
      <p class="${note.done ? 'done' : ''}">${note.text}</p>
      <div class="meta">📅 ${note.date} · ${days >= 0 ? days + ' Tage übrig' : 'Abgelaufen'}</div>
      <button onclick="toggleDone(${originalIndex})">✔️</button>
      <button class="secondary" onclick="editNote(${originalIndex})">✏️</button>
      <button class="secondary" onclick="deleteNote(${originalIndex})">🗑️</button>
      ${isToday ? `<button class="secondary my-day-toggle" onclick="toggleMyDay(${originalIndex})">⭐ ${note.inMyDay ? 'Entfernt' : 'Zu Mein Tag'}</button>` : ''}
    `;
    container.appendChild(div);
  });
}

function renderCalendar() {
  const cal = document.getElementById('calendar');
  const title = document.getElementById('monthYear');
  cal.innerHTML = '';

  const now = new Date();
  title.textContent = now.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });

  const year = now.getFullYear();
  const month = now.getMonth();
  const days = new Date(year, month + 1, 0).getDate();
  const start = new Date(year, month, 1).getDay();

  for (let i = 0; i < (start === 0 ? 6 : start - 1); i++)
    cal.appendChild(document.createElement('div'));

  for (let d = 1; d <= days; d++) {
    const div = document.createElement('div');
    div.className = 'day';
    div.textContent = d;

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayNotes = notes.filter(n => n.date === dateStr);

    if (dayNotes.length) {
      const dot = document.createElement('div');
      dot.className = `dot ${dayNotes[0].priority}-dot`;
      div.appendChild(dot);
    }
    cal.appendChild(div);
  }
}

function toggleDark() {
  document.body.classList.toggle('dark');
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

/* Elements */
const textEl = document.getElementById('text');
const dateEl = document.getElementById('date');
const priorityEl = document.getElementById('priority');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');

/* Init */
if (localStorage.getItem('darkMode') === 'true')
  document.body.classList.add('dark');

fetchNotes();
