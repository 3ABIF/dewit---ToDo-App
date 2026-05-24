### Vision - "Warum?"
Wir wollen sowohl vielbeschäftigten Studierenden als auch Berufstätigen eine stressfreie und einfache WebApp bieten, um ihre täglichen Aufgaben und universitären Abgabetermine so zu organisieren, dass sie produktiver und fokussierter an ihren Zielen arbeiten können.

### Ziel - "Was?"
Bis Juni/Juli 2026 wollen wir eine funktionsfähiges MVP (Minimum Viable Product) veröffentlichen.
Folgende Features sollen enthalten sein:
- Anlage von ToDos
- Planung von Deadlines mit Terminen (Fällig bis...)
- Einstellen von Dringlichkeit (Bewertung 1-3)
- "Mein Tag"- Feature (Hinzufügen von ToDos zur Tagesplanung)
- **Benutzer-Authentifizierung (Login/Signup)** ✅ Implementiert

### Benutzer-Authentifizierung - "Login/Signup Feature"

#### Funktionsweise:
Die Authentifizierung läuft serverseitig über **JWT (JSON Web Tokens)** mit bcrypt-Passwortverschlüsselung und bietet folgende Funktionen:

**1. Signup (Registrierung):**
- Benutzer können ein neues Konto mit Benutzername, E-Mail und Passwort erstellen
- Passwörter werden serverseitig mit bcrypt gehashed (salt rounds: 10)
- Benutzer werden in der PostgreSQL `users`-Tabelle gespeichert
- Nach erfolgreicher Registrierung wird automatisch ein JWT-Token generiert und der Benutzer eingeloggt

**2. Login:**
- Benutzer melden sich mit E-Mail und Passwort an
- Das Backend validiert die Zugangsdaten gegen die Datenbank
- Bei erfolgreicher Authentifizierung wird ein JWT-Token (Gültigkeit: 7 Tage) zurückgegeben
- Der Token wird clientseitig im `localStorage` gespeichert
- Die App bleibt nach dem Refresh angemeldet

**3. Logout:**
- Mit einem Klick auf den Logout-Button wird die Sitzung beendet
- Der Token wird aus dem `localStorage` gelöscht
- Der Benutzer wird zur Login-Seite weitergeleitet
- Notizen bleiben in der Datenbank erhalten und sind beim nächsten Login verfügbar

**4. Datenverwaltung:**
- Jeder Benutzer hat seine **eigenen Notizen** (getrennt durch `user_id` in der Datenbank)
- Notizen werden in der PostgreSQL `notes`-Tabelle gespeichert mit Foreign Key auf `users`
- `ON DELETE CASCADE` stellt sicher, dass alle Notizen gelöscht werden, wenn ein Benutzer gelöscht wird
- Dark-Mode Einstellung ist clientseitig im `localStorage` gespeichert

#### UI-Elemente:
- **Login Page**: `index-login.html` zeigt Login- und Registrierungsformular
- **Toggle Login/Signup**: Benutzer können zwischen Login und Registrierung wechseln
- **Toast Notifications**: Erfolgs- und Fehlermeldungen als animierte Toast-Benachrichtigungen
- **Logout Button**: In der App-Kopfzeile (neben Dark-Mode Toggle) verfügbar

#### Technische Implementierung:
- **Backend**: Express.js mit JWT (`jsonwebtoken`) und bcrypt (`bcryptjs`)
- **Auth-Endpunkte**: `/auth/register`, `/auth/login`, `/auth/verify`
- **Middleware**: `verifyToken` prüft JWT-Token in `Authorization`-Header für alle geschützten Endpunkte
- **Frontend**: `script-api.js` verwaltet Token-Speicherung und sendet `Bearer`-Tokens mit jeder Anfrage
- **Offline-Fallback**: `script.js` mit localStorage-Speicherung für lokale Entwicklung ohne Backend
- **Nginx**: Proxied `/api/` und `/auth/` Anfragen an das Backend

### Änderungsprotokoll (Changelog)

#### Phase 1: End-to-End Integration
- `index.html` lädt jetzt `script-api.js` (API-Modus) statt `script.js` (Offline-Modus)
- API-URLs in `script-api.js` und `index-login.html` auf relative Pfade (`/api`, `/auth`) geändert
- Nginx-Konfiguration um `/auth/` Proxy erweitert
- localStorage-Auth-Fallback aus Login-Seite entfernt (fehlerhafte Verbindungen werden jetzt korrekt gemeldet)

#### Phase 2: Sicherheitshärtung
- `JWT_SECRET` muss nun als Umgebungsvariable gesetzt sein (Server startet ohne diesen nicht)
- `jsonwebtoken` Version korrigiert (`9.1.2` → `9.0.0`, letztere existiert nicht)
- Dockerfile bereinigt (überflüssige Node.js Builder-Stage entfernt)
- `JWT_SECRET` in beide `docker-compose.yml`-Dateien hinzugefügt

#### Phase 3: UX-Polish
- Alle `alert()`-Aufrufe durch Toast-Benachrichtigungen ersetzt (Erfolg/Fehler/Warnung, auto-dismiss nach 3s)
- `prompt()`-Edit durch Inline-Bearbeitung ersetzt (Textarea + Speichern/Abbrechen-Buttons)
- CSS-Animationen für Toast-Ein-/Ausblenden hinzugefügt

#### Phase 4: Deployment-Readiness
- `.gitignore` hinzugefügt (`node_modules/`, `bin/`, `obj/`, `.env`, macOS-Metadata, IDE-Dateien)
- `README.md` vollständig überarbeitet mit Setup-Anleitung, API-Dokumentation und Deployment-Guide
- Vollständiger Authentifizierungsfluss getestet und verifiziert: Registrieren → Login → Notiz erstellen → Persistenz prüfen → Neuanmeldung

### Die Beteiligten - "Wer?"
Robin Steininger
Johannes Pernsteiner
