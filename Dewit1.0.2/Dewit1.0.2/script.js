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
  // Optional: keep date or clear it
  // dateEl.value = ''; 
}

function deleteNote(i) {
  if (!confirm('Notiz wirklich löschen?')) return;
  notes.splice(i, 1);
  saveNotes();
  renderNotes();
  renderCalendar();
}

function editNote(i) {
  const t = prompt('Notiz bearbeiten', notes[i].text);
  if (t !== null && t.trim() !== '') {
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
  const emptyState = document.getElementById('emptyState');
  container.innerHTML = '';

  const search = searchEl.value.toLowerCase();
  const filter = filterEl.value;

  // We map index to preserve original index for buttons
  let list = notes.map((note, idx) => ({ ...note, originalIndex: idx }));

  list = list.filter(n => n.text.toLowerCase().includes(search));

  if (filter === 'open') list = list.filter(n => !n.done);
  if (filter === 'done') list = list.filter(n => n.done);
  if (['important','medium','low'].includes(filter))
    list = list.filter(n => n.priority === filter);

  // Show/Hide Empty State
  if(list.length === 0) {
    emptyState.classList.remove('d-none');
  } else {
    emptyState.classList.add('d-none');
  }

  list.forEach((note) => {
    const i = note.originalIndex;
    const div = document.createElement('div');
    
    // Bootstrap Card Classes
    // border-start-3 gives a thick left border
    div.className = `card shadow-sm border-0 border-start border-4 border-${note.priority}`;

    const days = daysLeft(note.date);
    
    // Determine badge color and text
    let badgeClass = 'bg-secondary';
    let dayText = days + ' Tage';

    if (days < 0) { badgeClass = 'bg-danger'; dayText = 'Abgelaufen'; }
    else if (days === 0) { badgeClass = 'bg-warning text-dark'; dayText = 'Heute'; }
    else if (days === 1) { badgeClass = 'bg-info text-dark'; dayText = 'Morgen'; }

    // Map custom priority class to Bootstrap utility or custom CSS
    // Note: We use custom CSS classes defined in style.css for specific border colors
    // if bootstrap colors (danger/warning/success) aren't enough.
    // For this implementation, I updated the class mapping below:
    div.classList.add(`border-${note.priority}`); 

    div.innerHTML = `
      <div class="card-body d-flex align-items-center justify-content-between p-3">
        <div class="w-100 me-3">
          <div class="d-flex align-items-center mb-1">
             <span class="badge ${badgeClass} rounded-pill me-2">${dayText}</span>
             <small class="text-muted">${new Date(note.date).toLocaleDateString('de-DE')}</small>
          </div>
          <h5 class="card-title mb-0 ${note.done ? 'done-text' : ''}" style="word-break: break-word;">
            ${note.text}
          </h5>
        </div>
        
        <div class="btn-group" role="group">
          <button class="btn btn-sm ${note.done ? 'btn-success' : 'btn-outline-success'}" onclick="toggleDone(${i})" title="Erledigen">
            <i class="bi ${note.done ? 'bi-check-lg' : 'bi-circle'}"></i>
          </button>
          <button class="btn btn-sm btn-outline-secondary" onclick="editNote(${i})" title="Bearbeiten">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="deleteNote(${i})" title="Löschen">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
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
  let start = new Date(year, month, 1).getDay(); // 0 = Sun, 1 = Mon

  // Adjust so Monday is first day of week (European standard)
  // If start is 0 (Sun), it becomes 6 (7th slot). If 1 (Mon), it becomes 0.
  start = (start === 0 ? 7 : start) - 1; 

  // Empty slots
  for (let i = 0; i < start; i++) {
    cal.appendChild(document.createElement('div'));
  }

  for (let d = 1; d <= days; d++) {
    const div = document.createElement('div');
    div.className = 'day';
    div.textContent = d;

    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    
    // Only show dot for open notes
    const dayNotes = notes.filter(n => n.date === dateStr && !n.done);

    if (dayNotes.length) {
      // Pick highest priority color
      let dotColor = 'bg-low-dot';
      if (dayNotes.some(n => n.priority === 'important')) dotColor = 'bg-important-dot';
      else if (dayNotes.some(n => n.priority === 'medium')) dotColor = 'bg-medium-dot';

      const dot = document.createElement('div');
      dot.className = `dot ${dotColor}`;
      div.appendChild(dot);
    }
    cal.appendChild(div);
  }
}

function toggleDark() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-bs-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-bs-theme', newTheme);
  
  const icon = document.getElementById('themeIcon');
  if (newTheme === 'dark') {
    icon.classList.remove('bi-moon-stars-fill');
    icon.classList.add('bi-sun-fill');
  } else {
    icon.classList.remove('bi-sun-fill');
    icon.classList.add('bi-moon-stars-fill');
  }

  localStorage.setItem('theme', newTheme);
}

/* Elements */
const textEl = document.getElementById('text');
const dateEl = document.getElementById('date');
const priorityEl = document.getElementById('priority');
const searchEl = document.getElementById('search');
const filterEl = document.getElementById('filter');

/* Init */
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);
if (savedTheme === 'dark') {
  document.getElementById('themeIcon').classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
}

renderNotes();
renderCalendar();