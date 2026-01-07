# Webers Bestell-App (intern)

Interne Web-App (PWA-ähnlich) zum Bestellen per Produktbild. Ergebnis: E-Mail an `bestellung@webers-oelmuehle.de` mit PDF-Bestellschein im Anhang.

## Setup

### 1) Voraussetzungen
- Node.js (LTS)
- Git (optional, für Vercel Deployment)

### 2) Umgebungsvariablen
Lege lokal eine Datei `.env.local` an (in Projektwurzel):

```
ORDER_TO=bestellung@webers-oelmuehle.de

# optional: einfacher PIN für internen Zugriff (leer lassen = kein PIN)
APP_PIN=1234

# IONOS SMTP (empfohlen Port 587 STARTTLS)
SMTP_HOST=smtp.ionos.de
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=dein_absender@webers-oelmuehle.de
SMTP_PASS=DEIN_PASSWORT

# Absenderadresse (muss i.d.R. zum SMTP-User passen)
MAIL_FROM=Webers Ölmühle Bestell-App <dein_absender@webers-oelmuehle.de>
```

Hinweis: IONOS empfiehlt Port 587 mit TLS/STARTTLS. Alternativ Port 465 mit SSL.  
Siehe IONOS Hilfe.

### 3) Daten (Artikel)
Lege `data/articles.json` ab (Beispiel ist enthalten). Spalten: artikelnummer, artikelbezeichnung, einheit, kategorie, bild_url.

### 4) Starten
```
npm install
npm run dev
```

App läuft unter http://localhost:3000

## Deployment (Vercel, schnell)
1. Repo zu GitHub pushen
2. In Vercel: New Project → Repo importieren → Deploy
3. In Vercel Project Settings → Environment Variables: Werte aus `.env.local` eintragen
4. Redeploy → du erhältst einen Link (z.B. https://webers-bestellapp.vercel.app)

## Sicherheit (intern)
- Optionaler PIN (APP_PIN) auf Startseite
- Zusätzlich kannst du den Link nur an Stammkunden geben (intern)

