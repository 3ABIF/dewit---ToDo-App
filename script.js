let notes = JSON.parse(localStorage.getItem('dewitNotes')) || [];

function saveNotes() {
  localStorage.setItem('dewitNotes', JSON.stringify(notes));
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

  notes.push({ text, date, priority, done: false });
  saveNotes();
  renderNotes();
  renderCalendar();

  textEl.value = '';
  dateEl.value = '';
}

function deleteNote(i) {
  if (!confirm('Notiz löschen?')) return;
  notes.splice(i, 1);
  saveNotes();
  renderNotes();
  renderCalendar();
}

function editNote(i) {
  const t = prompt('Notiz bearbeiten', notes[i].text);
  if (t !== null) {
    notes[i].text = t;
    saveNotes();
    renderNotes();
  }
}

function toggleDone(i) {
  notes[i].done = !notes[i].done;
  saveNotes();
  renderNotes();
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

  list.forEach((note, i) => {
    const div = document.createElement('div');
    div.className = `note ${note.priority}`;

    const days = daysLeft(note.date);

    div.innerHTML = `
      <p class="${note.done ? 'done' : ''}">${note.text}</p>
      <div class="meta">📅 ${note.date} · ${days >= 0 ? days + ' Tage übrig' : 'Abgelaufen'}</div>
      <button onclick="toggleDone(${i})">✔️</button>
      <button class="secondary" onclick="editNote(${i})">✏️</button>
      <button class="secondary" onclick="deleteNote(${i})">🗑️</button>
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

renderNotes();
renderCalendar();
