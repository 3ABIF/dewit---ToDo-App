function addTask() {
    const taskText = document.getElementById('taskInput').value;
    const taskDate = document.getElementById('dateInput').value;
    const taskList = document.getElementById('taskList');

    if (taskText === '' || taskDate === '') {
        alert("Bitte gib eine Aufgabe und ein Datum ein!");
        return;
    }

    // Berechnung der verbleibenden Tage
    const today = new Date();
    const targetDate = new Date(taskDate);
    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Element erstellen
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${taskText} <br> <small>${taskDate}</small></span>
        <span class="days-left">${diffDays >= 0 ? 'Noch ' + diffDays + ' Tage' : 'Abgelaufen'}</span>
    `;

    taskList.appendChild(li);

    // Felder leeren
    document.getElementById('taskInput').value = '';
    document.getElementById('dateInput').value = '';
}