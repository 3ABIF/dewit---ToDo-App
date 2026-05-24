# Project Definition Document - dewit ToDo App

## Einführung

Das **dewit** Projekt ist eine moderne, responsive ToDo-Webanwendung, die entwickelt wurde, um Studierenden und Berufstätigen eine einfache Möglichkeit zu bieten, ihre täglichen Aufgaben und universitären Abgabetermine zu organisieren. Die App ermöglicht es, Prioritäten zu setzen und Fristen einzuhalten, ohne Stress.

### Ziele des Projekts
- Bereitstellung eines Minimum Viable Product (MVP) bis Juni/Juli 2026
- Features: Anlage von ToDos, Planung von Deadlines, Einstellen von Dringlichkeit (1-3), "Mein Tag"-Feature für Tagesplanung, Benutzer-Authentifizierung

### Beteiligte Entwickler
- Robin Steininger
- Johannes Pernsteiner

## Architekturübersicht

Die Anwendung folgt einer klassischen Client-Server-Architektur mit drei Hauptkomponenten:

1. **Frontend**: Vanilla JavaScript-Anwendung, serviert über Nginx
2. **Backend**: Express.js REST-API mit JWT-Authentifizierung
3. **Datenbank**: PostgreSQL 15

```
Frontend (Nginx + Vanilla JS) ←→ Backend (Express.js) ←→ Datenbank (PostgreSQL 15)
```

### Technologiestack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (kein Build-Schritt)
- **Backend**: Node.js 18, Express.js, JWT (`jsonwebtoken`), bcrypt (`bcryptjs`)
- **Datenbank**: PostgreSQL 15
- **Deployment**: Docker, Docker Compose, Nginx (Reverse Proxy)
- **Styling**: Responsive Design mit CSS-Variablen für Dark Mode

## Dateien und ihre Aufgaben

### Root-Verzeichnis

#### `README.md`
- Vollständige Projektdokumentation mit Setup-Anleitung, API-Dokumentation, Datenbankschema und Deployment-Guide
- Zweck: Erste Orientierung und vollständige Referenz für Entwickler

#### `SETUP.md`
- Detaillierte Anleitung zur Architektur und zum Setup
- Enthält Quick Start mit Docker, lokale Entwicklungsschritte, Features-Liste, Datenbankschema und API-Endpunkte
- Zweck: Vollständige Setup-Dokumentation

#### `Project Description - ToDo App - dewit!.md`
- Projektvision, Ziele und Features
- Beschreibung der Benutzer-Authentifizierung
- Änderungsprotokoll (Changelog) aller Phasen
- Zweck: Überblick über die Projektziele, Roadmap und Entwicklungsgeschichte

#### `Project_Definition_Document.md`
- Dieses Dokument: Vollständige technische Dokumentation des Projekts
- Zweck: Technisches Verständnis des gesamten Codebases für Entwickler

#### `Dewit_Backlog.mk`
- Akzeptanzkriterien für Features (Markdown-Kanban-Board, kein Makefile)
- Zweck: Definition der Anforderungen und Qualitätskriterien

#### `index.html`
- Haupt-HTML-Datei der Anwendung
- Struktur: Header mit Titel, Benutzeranzeige, Dark Mode Toggle und Logout; "Mein Tag"-Sektion; Formular für neue Notizen; Such-/Filterleiste; Kalender; Notizen-Container; Toast-Benachrichtigungen
- Lädt `script-api.js` (API-Modus, Standard) oder `script.js` (Offline-Modus)
- Zweck: Grundgerüst der Benutzeroberfläche

#### `index-login.html`
- Login- und Registrierungsseite
- Enthält eingebettetes CSS für das Login-Design und JavaScript für die Authentifizierung
- Relativer Pfad `/auth` für API-Anfragen (funktioniert mit Nginx-Proxy)
- Zweck: Benutzer-Authentifizierung (Login/Signup)

#### `style.css`
- CSS-Stylesheet für das gesamte Styling
- Features: Responsive Design, CSS-Variablen für Farben, Dark Mode, Prioritätsfarben (wichtig=rot, mittel=orange, egal=grün), Toast-Benachrichtigungen, Inline-Bearbeitung
- Zweck: Visuelle Gestaltung der Anwendung

#### `script-api.js`
- JavaScript-Datei für API-Kommunikation mit dem Backend
- Funktionen: `showToast()`, `checkAuth()`, `fetchNotes()`, `addNote()`, `deleteNote()`, `startInlineEdit()`, `saveInlineEdit()`, `toggleDone()`, `toggleMyDay()`, `renderMyDay()`, `renderNotes()`, `renderCalendar()`, `toggleDark()`, `logout()`
- Verwendet relative API-URLs (`/api`, `/auth`) für Nginx-Proxy-Kompatibilität
- Toast-Benachrichtigungen für alle Aktionen (Erfolg/Fehler/Warnung)
- Zweck: Verbindung zwischen Frontend und Backend-API (Produktionsmodus)

#### `script.js`
- Offline JavaScript-Implementierung mit localStorage
- Funktionen: Login-Check, Logout, per-Benutzer-Notizenspeicherung, addNote(), deleteNote(), editNote(), toggleDone(), toggleMyDay(), renderMyDay(), renderNotes(), renderCalendar()
- Zweck: Lokaler Demo-Modus ohne Backend (Offline-Entwicklung)

#### `nginx.conf`
- Nginx-Konfigurationsdatei
- Features: Serviert statische Dateien, proxied `/api/` und `/auth/` Anfragen an Backend (Port 3001)
- Zweck: Webserver-Konfiguration für Produktionsumgebung

#### `Dockerfile`
- Docker-Build-Datei für Frontend (Nginx)
- Kopiert statische Dateien direkt in Nginx-Container (kein Build-Schritt nötig)
- Zweck: Containerisierung des Frontends

#### `docker-compose.yml`
- Docker Compose-Datei für vollständige Anwendung (Frontend + Backend + Database)
- Services: postgres (Port 5432), backend (Port 3001), frontend (Port 80)
- Health-Check für PostgreSQL, Backend startet erst nach erfolgreichem Health-Check
- Umgebungsvariablen: `JWT_SECRET`, `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`
- Zweck: Orchestrierung aller Komponenten für Entwicklung und Produktion

#### `.gitignore`
- Ausschlussregeln für Git: `node_modules/`, `bin/`, `obj/`, `.env`, `.DS_Store`, `__MACOSX/`, `.vscode/`, `*.zip`
- Zweck: Verhindert das Commiten von Build-Artefakten, Secrets und IDE-Dateien

### Backend-Verzeichnis (`backend/`)

#### `README.md`
- Spezifische Dokumentation für das Backend
- Zweck: Backend-spezifische Informationen

#### `package.json`
- Node.js-Projektdefinition
- Abhängigkeiten: `express`, `pg` (PostgreSQL-Treiber), `cors`, `dotenv`, `bcryptjs`, `jsonwebtoken`
- Dev-Abhängigkeiten: `nodemon`
- Scripts: `start` (Produktion), `dev` (Entwicklung mit nodemon)
- Zweck: Definition der Backend-Abhängigkeiten und Scripts

#### `server.js`
- Hauptserver-Datei mit Express.js
- Features: CORS-Unterstützung, JSON-Middleware, REST-API-Endpunkte, JWT-Authentifizierung
- Endpunkte:
  - POST `/auth/register`: Benutzer registrieren
  - POST `/auth/login`: Benutzer einloggen
  - GET `/auth/verify`: JWT-Token verifizieren
  - GET `/api/notes`: Alle Notizen des aktuellen Benutzers abrufen
  - POST `/api/notes`: Neue Notiz erstellen
  - PUT `/api/notes/:id`: Notiz aktualisieren (text, done, inMyDay)
  - DELETE `/api/notes/:id`: Notiz löschen
- Zweck: Implementierung der REST-API und Authentifizierung

#### `auth.js`
- Authentifizierungsmodul
- Funktionen: `verifyToken` (JWT-Middleware), `generateToken` (JWT-Token-Erstellung), `hashPassword` (bcrypt-Hashing), `comparePassword` (bcrypt-Vergleich)
- JWT-Token-Gültigkeit: 7 Tage
- `JWT_SECRET` muss als Umgebungsvariable gesetzt sein (Server startet ohne diesen nicht)
- Zweck: Zentrale Authentifizierungslogik

#### `db.js`
- Datenbankverbindungsmodul
- Verwendet `pg`-Pool für PostgreSQL-Verbindung
- Konfiguration über Umgebungsvariablen (`DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`)
- Zweck: Zentralisierte Datenbankverbindung

#### `schema.sql`
- SQL-Schema für die Datenbank
- Tabellen: `users` (id, username, email, password_hash, created_at, updated_at), `notes` (id, user_id, text, date, priority, done, in_my_day, created_at, updated_at)
- Indizes: `user_id`, `date`, `priority`, `email`
- Foreign Key: `notes.user_id` → `users.id` mit `ON DELETE CASCADE`
- Constraint: `priority` muss 'important', 'medium' oder 'low' sein
- Zweck: Definition der Datenbankstruktur

#### `Dockerfile`
- Docker-Build-Datei für Backend
- Node.js 18 Alpine Image, Installation von Abhängigkeiten, Start des Servers
- Zweck: Containerisierung des Backends

#### `docker-compose.yml`
- Docker Compose für Backend-only Setup (Backend + Database)
- Services: postgres (Port 5433), backend (Port 3001)
- Zweck: Unabhängiges Backend-Testing

#### `.env.example`
- Vorlage für Umgebungsvariablen
- Enthält: `PORT`, `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT`, `JWT_SECRET`
- Zweck: Referenz für lokale Entwicklung

## Datenbankschema

### Users Tabelle
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notes Tabelle
```sql
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text VARCHAR(500) NOT NULL,
  date DATE NOT NULL,
  priority VARCHAR(20) NOT NULL CHECK (priority IN ('important', 'medium', 'low')),
  done BOOLEAN DEFAULT FALSE,
  in_my_day BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_id ON notes(user_id);
CREATE INDEX idx_date ON notes(date);
CREATE INDEX idx_priority ON notes(priority);
CREATE INDEX idx_user_email ON users(email);
```

## API-Endpunkte

### Authentifizierung

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|-------------|------|
| POST | `/auth/register` | Benutzer registrieren | Nein |
| POST | `/auth/login` | Benutzer einloggen | Nein |
| GET | `/auth/verify` | JWT-Token verifizieren | Ja |

### Notizen

| Methode | Endpunkt | Beschreibung | Auth |
|---------|----------|-------------|------|
| GET | `/api/notes` | Alle Notizen des Benutzers abrufen | Ja |
| POST | `/api/notes` | Neue Notiz erstellen | Ja |
| PUT | `/api/notes/:id` | Notiz aktualisieren | Ja |
| DELETE | `/api/notes/:id` | Notiz löschen | Ja |

### Authentifizierung
Alle geschützten Endpunkte erfordern einen `Bearer`-Token im `Authorization`-Header:
```
Authorization: Bearer <jwt-token>
```

## Setup und Ausführung

### Schnellstart mit Docker
```bash
docker-compose up
```
- Frontend: http://localhost (Nginx, Port 80)
- Backend: http://localhost:3001 (Express API)
- Datenbank: PostgreSQL auf Port 5432

### Lokale Entwicklung

#### Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev   # mit nodemon
# oder
npm start     # Produktion
```

#### Frontend
- Öffne `index.html` im Browser oder verwende Live Server
- Für API-Modus: `script-api.js` laden (Standard)
- Für Offline-Modus: `script.js` laden (localStorage)

### Deployment

#### Portainer
1. Repository zu GitHub pushen
2. In Portainer: **Stacks** → **Add Stack**
3. Root `docker-compose.yml` einfügen
4. Umgebungsvariablen setzen (`JWT_SECRET` erforderlich)
5. Deployen

## Funktionalitäten

- ✅ Benutzer-Authentifizierung (Registrieren/Einloggen/Ausloggen mit JWT)
- ✅ ToDos erstellen, lesen, aktualisieren, löschen
- ✅ Datumsbasierte Organisation
- ✅ Prioritätsstufen (wichtig, mittel, egal)
- ✅ "Mein Tag"-Sektion für heutige Aufgaben
- ✅ Suche und Filter
- ✅ Dark Mode
- ✅ Responsive Design
- ✅ Toast-Benachrichtigungen für alle Aktionen
- ✅ Inline-Bearbeitung von Notizen
- ✅ Kalender-Übersicht mit Prioritäts-Punkten

## Änderungsprotokoll (Changelog)

### Phase 1: End-to-End Integration
- `index.html` lädt jetzt `script-api.js` statt `script.js`
- API-URLs auf relative Pfade (`/api`, `/auth`) geändert
- Nginx-Konfiguration um `/auth/` Proxy erweitert
- localStorage-Auth-Fallback aus Login-Seite entfernt

### Phase 2: Sicherheitshärtung
- `JWT_SECRET` muss als Umgebungsvariable gesetzt sein
- `jsonwebtoken` Version korrigiert (`9.1.2` → `9.0.0`)
- Dockerfile bereinigt (überflüssige Node.js Stage entfernt)
- `JWT_SECRET` in beide `docker-compose.yml`-Dateien hinzugefügt

### Phase 3: UX-Polish
- `alert()` durch Toast-Benachrichtigungen ersetzt
- `prompt()` durch Inline-Bearbeitung ersetzt
- CSS-Animationen für Toasts hinzugefügt

### Phase 4: Deployment-Readiness
- `.gitignore` hinzugefügt
- `README.md` vollständig überarbeitet
- Vollständiger Authentifizierungsfluss getestet und verifiziert

Dieses Dokument soll es ermöglichen, den Code des dewit-Projekts vollständig zu verstehen und weiterzuentwickeln.
