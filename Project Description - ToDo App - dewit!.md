
### Vision - "Warum?"
Wir wollen sowohl vielbeschäftigten Studierenden als auch Berufstätigen eine stressfreie und einfache WebApp bieten, um ihre täglichen Aufgaben und universitären Abgabetermine so zu organisieren, dass sie produktiver und fokussierter an ihren Zielen arbeiten können.

### Ziel - "Was?"
Bis Juni/Juli 2026 wollen wir eine funktionsfähiges MVP (Minimum Viable Product) veröffentlichen.
Folgende Features sollen enthalten sein:
- Anlage von ToDos
- Planung von Deadlines mit Terminen (Fällig bis...)
- Einstellen von Dringlichkeit (Bewertung 1-3)
- "Mein Tag"- Feature (Hinzufügen von ToDos zur Tagesplanung)
- **Benutzer-Authentifizierung (Login/Signup)** ✅ NEU

### Benutzer-Authentifizierung - "Login/Signup Feature"

#### Funktionsweise:
Die Authentifizierung funktioniert vollständig client-seitig mit **localStorage** und bietet folgende Funktionen:

**1. Signup (Registrierung):**
- Benutzer können ein neues Konto mit Benutzername und Passwort erstellen
- E-Mail wird als optionales Feld akzeptiert (zur Kontakt-Verifikation)
- Alle Benutzer werden in `dewitUsers` im localStorage gespeichert
- Passwörter werden gehashed (einfache Verschlüsselung für Client-Seite)

**2. Login:**
- Benutzer melden sich mit Benutzername und Passwort an
- Die Anwendung validiert die Zugangsdaten gegen gespeicherte Benutzer
- Eine aktive Sitzung wird erstellt (`currentUser` im localStorage)
- Die App bleibt nach dem Refresh angemeldet

**3. Logout:**
- Mit Bestätigung können Benutzer sich abmelden
- Die Sitzung wird beendet und der Benutzer muss sich erneut anmelden
- Notizen bleiben erhalten und sind beim nächsten Login verfügbar

**4. Datenverwaltung:**
- Jeder Benutzer hat seine **eigenen Notizen** (getrennt nach Benutzername)
- Notizen werden in `dewitNotes_[Benutzername]` gespeichert
- Dark-Mode Einstellung ist global (für alle Benutzer gleich)

#### UI-Elemente:
- **Login Modal**: Erscheint beim ersten Laden der App
- **Toggle Login/Signup**: Benutzer können zwischen Login und Registrierung wechseln
- **Error-Handling**: Fehlermeldungen bei leeren Feldern oder falschen Zugangsdaten
- **Logout Button**: In der App-Kopfzeile (neben Dark-Mode Toggle) verfügbar

#### Technische Implementierung:
- Alle Funktionen in `script.js` implementiert
- Keine externe Authentifizierungs-API erforderlich
- Vollständig offline-funktionsfähig
- HTML Modal mit ansprechender Gestaltung

### Die Beteiligten - "Wer?"
Robin Steininger
Johannes Pernsteiner

