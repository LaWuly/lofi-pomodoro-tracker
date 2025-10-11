# Lofi Pomodoro Tracker → Life Tracker

Timer **25 + 5** sviluppato con **React + TypeScript + Vite**.  
Questa prima versione (**v1.0.0**) completa i **requisiti FCC** ed è la base del futuro _Life Tracker_ con log, musica chill e minigiochi.

---

## Funzionalità attuali (v1.0.0)

- Start / Pausa / Reset
- Switch automatico tra _Session_ ↔ _Break_ allo 0
- Formato tempo **mm:ss** con durata di default 25/5 min
- Limiti: 1 – 60 min per entrambe le fasi
- Pulsanti ± disabilitati durante il run
- **Beep audio** e **hold su 00:00 ≥ 1 s** prima del cambio fase
- Logica separata in moduli (`domain` / `app`) per scalabilità futura

---

## Stack tecnico

- **React 18 + TypeScript + Vite**
- Architettura modulare
  - `/domain` → logica pura del timer (`TimerEngine`, tipi, util)
  - `/app` → hook React (`usePomodoro`) e componenti UI
- **ESLint + Prettier** → code quality
- **CSS Modules** → stile isolato e riutilizzabile

---

## Hub a griglia (v1.1)

La home mostra una **griglia di app** che funge da hub:

- ⏱ Timer → `/apps/clock`
- 🧮 Calculator → `/apps/calculator` (stub)
- 📓 Markdown → `/apps/markdown` (stub)
- 📔 Journal → `/apps/journal` (stub)
- 🥁 Drum → `/apps/drum` (stub)

**Accessibilità:** card con `aria-label`, **focus** visibile, navigazione da tastiera (TAB/ENTER/SPACE).  
**Nota routing:** in produzione configura il fallback SPA (es. Netlify: redirect `/* -> /index.html`).

---

## Roadmap

**v1.0.0 — Requisiti FCC**

- 25+5 completo: 00:00 mostrato ≥ 1s, beep audio, ID FCC conformi

**v1.1.0 — Hub a griglia + routing (questa versione)**

- Home a griglia con 5 card (Timer, Calculator, Markdown, Journal, Drum)
- Navigazione via route `/apps/*` (client-side, senza refresh)
- Accessibilità: aria-label sulle card, focus ring visibile, tab order sensato
- Il Timer FCC è ora disponibile in `/apps/clock` (invariato nella logica)

Prossime milestone:

- v1.2 — Router /apps/\* con **lazy loading**
- v1.3 — Calculator (FCC completa)
- v1.4 — Markdown Previewer (FCC)
- v1.5 — Journal (MVP) con storage locale
- v1.6 — Drum Machine (FCC)
- v2.0 — UX & storage preferenze globali
- v3.0 — Player lofi + auto-switch con Pomodoro

---

## ▶️ Avvio locale

```bash
npm install
npm run dev
```
