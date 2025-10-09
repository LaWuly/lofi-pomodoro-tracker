# Lofi Pomodoro Tracker (v0.1)

Timer **25+5** sviluppato con **React + TypeScript + Vite**.  
Questa prima versione implementa il **core timer locale**, base per il futuro _Life Tracker_.

---

## Funzionalità attuali (v0.1)

- Start / Pausa / Reset
- Switch automatico tra _Session_ e _Break_ allo 0
- Limiti 1..60 minuti per entrambe le durate
- Pulsanti ± disabilitati durante il run
- Logica separata in moduli (`domain` / `app`) per una futura estensione

---

## Stack tecnico

- **React 18 + TypeScript (Vite)**
- ESLint + Prettier (code quality)
- Architettura modulare con:
  - `/domain`: logica pura del timer (`TimerEngine`, tipi, util)
  - `/app`: hook React (`usePomodoro`) e componenti UI

---

## Roadmap

v0.1 — Core timer locale
v1.0 — Requisiti FCC (00:00 per 1s, beep audio, ID FCC)
v1.1 — UI lofi (mm:ss, localStorage, accessibilità)
v2.0 — Log attività (note/tag) + pagina Storico
v3.0 — Player musica chill/break

---

## ▶️ Avvio locale

```bash
npm install
npm run dev
```
