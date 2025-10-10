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
