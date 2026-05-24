# Project Definition Document - dewit ToDo App

## Einführung

Das **dewit** Projekt ist eine moderne, responsive ToDo-Webanwendung für Studierende und Berufstätige. Ziel ist es, alltägliche Aufgaben, Deadlines und Tagespläne effizient zu verwalten – sowohl lokal als auch über eine Backend-API mit Benutzer-Authentifizierung.

### Ziele des Projekts
- Einsatzbereites MVP für Aufgaben- und Tagesplanung
- Features: Aufgaben anlegen, Fristen setzen, Prioritäten wählen, "Mein Tag"-Ansicht
- Flexible Nutzung: lokal mit `localStorage` und optional mit Backend-API

### Beteiligte Entwickler
- Robin Steininger
- Johannes Pernsteiner

## Architekturübersicht

Die Anwendung kann als hybride Architektur betrachtet werden:

1. **Frontend**: Vanilla JavaScript, HTML & CSS (Client-seitige App)
2. **Backend**: Express.js REST-API mit JWT-Authentifizierung
3. **Datenbank**: PostgreSQL für persistente Benutzerdaten und Notizen

```
Frontend (Browser) ←→ Backend (Express.js) ←→ PostgreSQL
       ↑
       └── localStorage-Fallback (Offline-Modus)
```

### Technologiestack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Datenbank**: PostgreSQL
- **API-Sicherheit**: JWT-Token
- **Deployment**: Docker, Docker Compose
- **Styling**: Responsive Design, Dark Mode

## Dateien und ihre Aufgaben

### Root-Verzeichnis

#### `README.md`
- Projektübersicht und Einstiegshinweise
- Zweck: Repositoriumsbeschreibung für Entwickler

#### `SETUP.md`
- Setup-Anleitung und Architekturhinweise
- Zweck: Detailliertes Setup und Start-Prozeduren

#### `Project Description - ToDo App - dewit!.md`
- Projektvision, Ziele und Roadmap
- Zweck: Strategische Projektbeschreibung

#### `Dewit_Backlog.mk`
- Akzeptanzkriterien und Aufgabenliste
- Zweck: Definition von Anforderungen und Funktionen

#### `index.html`
- Haupt-UI der Anwendung
- Enthält Header, "Mein Tag"-Bereich, Notizformular, Such- und Filterleiste, Kalender und Notizenbereich
- Zweck: Benutzeroberfläche für die ToDo-App

#### `index-login.html`
- Login-/Registrierungsseite für Benutzer
- Enthält lokale und Server-basierte Authentifizierung mit Online-/Offline-Fallback
- Zweck: Einstiegspunkt für Benutzeranmeldung

#### `style.css`
- Globales Design und responsive Stilregeln
- Enthält Farben, Layout, Dark Mode, Button- und Notiz-Styles
- Zweck: Visuelle Darstellung und responsive Darstellung

#### `script.js`
- Lokale Anwendungslogik mit `localStorage`
- Funktionen: Authentifizierungsprüfung, Notizerstellung, Bearbeitung, Löschen, Toggle Done, Mein Tag, Suche/Filter, Kalenderdarstellung
- Zweck: Haupt-Clientlogik für lokale Nutzung

#### `script-api.js`
- API-Client für Backend-Kommunikation
- Funktionen: Authentifizierter Abruf, Erstellen, Aktualisieren, Löschen von Notizen
- Zweck: Alternative Frontend-Implementierung für Backend-gestützte Nutzung

#### `nginx.conf`
- Nginx-Webserverkonfiguration
- Zweck: Bereitstellung statischer Ressourcen und API-Proxy in Produktionsumgebungen

#### `Dockerfile`
- Containerisierung des Frontends
- Zweck: Erstellen eines Deploy-Images für die Webanwendung

#### `docker-compose.yml`
- Orchestrierung der kompletten Anwendung
- Services: frontend, backend, postgres
- Zweck: Lokales und produktionsnahes Zusammenspiel aller Komponenten

### Backend-Verzeichnis (`backend/`)

#### `README.md`
- Backend-spezifische Dokumentation
- Zweck: Backend-Setup und Entwicklungsinformationen

#### `package.json`
- Node-Paketdefinition mit Abhängigkeiten und Skripten
- Abhängigkeiten: `express`, `pg`, `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken`
- Skripte: `start`, `dev`
- Zweck: Verwaltung des Backend-Projekts

#### `server.js`
- Express.js-Server mit Auth- und Notiz-API
- Endpunkte:
  - `POST /auth/register` – Benutzerregistrierung
  - `POST /auth/login` – Benutzeranmeldung
  - `GET /auth/verify` – Token-Überprüfung
  - `GET /api/notes` – Notizen des angemeldeten Benutzers
  - `POST /api/notes` – Notiz erstellen
  - `PUT /api/notes/:id` – Notiz aktualisieren
  - `DELETE /api/notes/:id` – Notiz löschen
- Zweck: Backend-API für persistente und gesicherte Datenverwaltung

#### `auth.js`
- Authentifizierungsmodul mit JWT und Passwort-Hashing
- Funktionen: `verifyToken`, `generateToken`, `hashPassword`, `comparePassword`
- Zweck: Sicherheit und Nutzerauthentifizierung

#### `db.js`
- PostgreSQL-Verbindung mit `pg.Pool`
- Konfiguration über Umgebungsvariablen
- Zweck: Zentralisierte Datenbankverbindung

#### `schema.sql`
- Datenbankschema für Benutzer und Notizen
- Zweck: Persistente Tabellenstruktur

#### `Dockerfile`
- Backend-Container-Build für Node.js
- Zweck: Deployment des Backend-Services

#### `docker-compose.yml`
- Backend/Datenbank-Konfiguration für lokale Entwicklung
- Zweck: Backend-Testumgebung ohne Frontend

## Datenbankschema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('important', 'medium', 'low')),
  done BOOLEAN DEFAULT FALSE,
  in_my_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API-Endpunkte

| Methode | Endpunkt | Beschreibung |
|---------|----------|-------------|
| POST | `/auth/register` | Benutzerregistrierung |
| POST | `/auth/login` | Benutzeranmeldung |
| GET | `/auth/verify` | JWT-Token validieren |
| GET | `/api/notes` | Notizen des aktuellen Benutzers abrufen |
| POST | `/api/notes` | Neue Notiz erstellen |
| PUT | `/api/notes/:id` | Notiz aktualisieren |
| DELETE | `/api/notes/:id` | Notiz löschen |

## Authentifizierung und Benutzerfluss

### Online-Modus
- Benutzer melden sich an oder registrieren sich über `index-login.html`
- Der Server prüft Anmeldedaten und gibt einen JWT-Token zurück
- Token wird in `localStorage` gespeichert
- `script-api.js` nutzt den Token für geschützte API-Aufrufe

### Offline-Fallback
- Wenn der Backend-Server nicht erreichbar ist, fällt die App auf lokale Authentifizierung zurück
- Benutzerkonten und Passworthashes werden in `localStorage` gespeichert (`dewitUsers`)
- Notizen werden lokal in `dewitNotes_[Benutzername]` gespeichert

### Session und Logout
- Nach erfolgreichem Login ist die Sitzung aktiv bis zum Logout
- Logout entfernt `token` und `user` aus `localStorage`
- Danach wird der Benutzer zurück zur Login-Seite geleitet

## Frontend-Funktionalität

- Benutzer-spezifische Notizen mit lokalem und optionalem API-Speicher
- Notiz hinzufügen, bearbeiten, löschen
- Erledigte Aufgaben markieren
- Prioritäten: wichtig, mittel, egal
- Today-View: Aufgaben des aktuellen Tages anzeigen
- Such- und Filterfunktionen
- Tages-Kalenderübersicht mit Markierung von Notiztagen
- Dark Mode und responsive Darstellung

## Setup und Ausführung

### Schnellstart mit Docker
```bash
docker-compose up
```
- Frontend: http://localhost
- Backend: http://localhost:3001
- PostgreSQL: Port 5432

### Lokale Entwicklung
1. `cd backend`
2. `npm install`
3. `npm run dev`
4. Öffne `index-login.html` oder `index.html` im Browser

### Hinweise
- Die Backend-API nutzt Umgebungsvariablen für Datenbankzugang und JWT-Secret
- Lokaler Fallback bietet Offline-Zugriff ohne serverseitige Authentifizierung

## Aktuelle Projektfunktionen

- ✅ Aufgaben anlegen, lesen, bearbeiten, löschen
- ✅ Tagesansicht "Mein Tag"
- ✅ Prioritätsfilter und Statusfilter
- ✅ Benutzeranmeldung / Registrierung
- ✅ JWT-basierte API-Authentifizierung
- ✅ Offline-Fallback mit localStorage
- ✅ Kalenderansicht zur Monatsübersicht
- ✅ Dark Mode
- ✅ Responsives Layout
