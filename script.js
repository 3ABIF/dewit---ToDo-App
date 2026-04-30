let notes = [];
let currentUser = null;

function clearSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

function getPageUrl(page) {
  return window.location.href.replace(/\/[^\/\?#]*([\?#].*)?$/, '/' + page);
}

function goToLogin() {
  window.location.replace(getPageUrl('index-login.html'));
}

function goToIndex() {
  window.location.replace(getPageUrl('index.html'));
}

function getNotesKey() {
  return currentUser ? `dewitNotes_${currentUser.username}` : 'dewitNotes';
}

function saveNotes() {
  localStorage.setItem(getNotesKey(), JSON.stringify(notes));
}

function loadNotes() {
  const stored = localStorage.getItem(getNotesKey());
  if (stored) {
    notes = JSON.parse(stored);
    return;
  }

  const legacy = localStorage.getItem('dewitNotes');
  if (legacy) {
    notes = JSON.parse(legacy);
    saveNotes();
    return;
  }

  notes = [];
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

function addNote() {
  const text = textEl.value;
  const date = dateEl.value;
  const priority = priorityEl.value;

  if (!text || !date) return alert('Bitte Text und Datum eingeben');

  notes.push({ text, date, priority, done: false, inMyDay: false });
  saveNotes();
  renderNotes();
  renderMyDay();
  renderCalendar();

  textEl.value = '';
  dateEl.value = '';
}

function deleteNote(i) {
  if (!confirm('Notiz löschen?')) return;
  notes.splice(i, 1);
  saveNotes();
  renderNotes();
  renderMyDay();
  renderCalendar();
}

function editNote(i) {
  const t = prompt('Notiz bearbeiten', notes[i].text);
  if (t !== null) {
    notes[i].text = t;
    saveNotes();
    renderNotes();
    renderMyDay();
  }
}

function toggleDone(i) {
  notes[i].done = !notes[i].done;
  saveNotes();
  renderNotes();
  renderMyDay();
}

function toggleMyDay(i) {
  notes[i].inMyDay = !notes[i].inMyDay;
  saveNotes();
  renderMyDay();
  renderNotes();
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

function logout() {
  clearSession();
  currentUser = null;
  notes = [];
  goToLogin();
}

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (!token || !user) {
    clearSession();
    window.location.href = 'index-login.html';
    return false;
  }

  try {
    currentUser = JSON.parse(user);
  } catch (err) {
    clearSession();
    window.location.href = 'index-login.html';
    return false;
  }

  if (!currentUser || !currentUser.username) {
    clearSession();
    window.location.href = 'index-login.html';
    return false;
  }

  const userDisplay = document.getElementById('userDisplay');
  if (userDisplay) {
    userDisplay.textContent = `👤 ${currentUser.username}`;
  }

  return true;
}

/* Elements */
const textEl = document.getElementById('text');
const dateEl = document.getElementById('date');
const priorityEl = document.getElementById('priority');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');

function initApp() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  loadNotes();

  // Migration: Add inMyDay field to existing notes
  notes = notes.map(note => ({
    ...note,
    inMyDay: note.inMyDay || false
  }));

  renderMyDay();
  renderNotes();
  renderCalendar();
}

window.addEventListener('DOMContentLoaded', () => {
  if (checkAuth()) {
    initApp();
  }
});
