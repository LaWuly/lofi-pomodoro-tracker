# Lofi Pomodoro Tracker → Life Tracker

Timer **25 + 5**, **Calculator FCC** e **Journal (MVP)** sviluppati con **React + TypeScript + Vite**.  
Le versioni **v1.0 → v1.5** completano i **requisiti FreeCodeCamp** e introducono le prime funzioni del futuro _Life Tracker_ con log, musica chill e minigiochi.

---

## Funzionalità attuali (v1.5.0)

### Timer (25 + 5 Clock)

- Start / Pausa / Reset
- Switch automatico tra _Session_ ↔ _Break_ allo 0
- Formato tempo **mm:ss** (25/5 min di default)
- Limiti 1–60 min, pulsanti ± disabilitati durante il run
- **Beep audio** e **hold su 00:00 ≥ 1 s** prima del cambio fase
- Logica modulare (`TimerEngine` e `usePomodoro`)

### Calculator (FCC)

- Implementa tutte le **User Story FCC (#1–#15)**
- Input da click o tastiera (`0–9`, `.`, `+ - * /`, `Enter`, `Esc`)
- Supporta numeri decimali, catene di operazioni e segno negativo
- Gestione consecutiva operatori (`5 * - + 5 = → 10`)
- Continuazione dopo `=` (`5 - 2 = / 2 = → 1.5`)
- Formattazione output (`Error`, `∞`, arrotondamento a 12 cifre)
- Layout e focus ring coerenti con il TimerFCC (CSS Modules, a11y)

### Journal (v1.5.0)

> MVP con mood tracker, note Plain/Markdown e stub Pomodoro / Workout / Ciclo

- Creazione e salvataggio note giornaliere (`localStorage`)
- Selettore umore 1–5 con emoji
- Formato testo **Plain / Markdown** + anteprima live
- Accessibilità base: focus visibile, `aria-pressed`, tab order coerente
- Stub visivi per:
  - 📋 Log attività Pomodoro (integrazione futura col timer)
  - 🏋️ Workout tracker (allenamenti)
  - 🌙 Cycle tracker (monitoraggio ciclo)
- Tipi e hook dedicati (`useJournal`, `JournalEntry`)
- Stile coerente con il resto dell’app (card, grid, focus ring)

---

## Stack tecnico

- **React 18 + TypeScript + Vite**
- Architettura modulare
  - `/domain` → logica pura (TimerEngine, CalculatorEngine, parser Markdown)
  - `/app` → hook React, UI FCC e moduli Journal
- **ESLint + Prettier** → code quality
- **CSS Modules** → stile isolato e riutilizzabile
- **Netlify-ready**: SPA rewrite (`public/_redirects`) + prefetch chunk

---

## Hub a griglia (v1.1+)

La home mostra una **griglia di app** che funge da hub:

- ⏱ Timer → `/apps/clock`
- 🧮 Calculator → `/apps/calculator`
- 📓 Markdown → `/apps/markdown`
- 📔 Journal → `/apps/journal`
- 🥁 Drum → `/apps/drum`

**Accessibilità:** card con `aria-label`, **focus** visibile, navigazione da tastiera (TAB / ENTER / SPACE).

---

## Roadmap

**v1.0.0 — Timer (FCC)**

- 25+5 completo: 00:00 mostrato ≥ 1s, beep audio, ID FCC conformi

**v1.1.0 — Hub a griglia + routing**

- Home a griglia con 5 card (Timer, Calculator, Markdown, Journal, Drum)
- Navigazione via route `/apps/*`, accessibilità migliorata

**v1.2.0 — Routing + Lazy Loading (Deploy-ready)**

- `React.lazy` + `Suspense` per `/apps/*`
- Prefetch chunk su hover/focus + alias puliti + rewrite Netlify

**v1.3.0 — Calculator (FCC)**

- UI completa con ID FCC e tastiera
- Logica lineare L2R (left-to-right) con segno, decimali e operatori consecutivi
- Stile coerente con TimerFCC (card, grid, btn, focus ring)
- Tutti i test FCC passati ✅

**v1.4.0 — Markdown Previewer (FCC)**  
Split pane editor/preview, parser Markdown leggero e sanitizer base  
Tema coerente col resto dell’app

**v1.5.0 — Journal (MVP)**  
Mood tracker, note Plain/Markdown, storage locale e stub Pomodoro/Workout/Ciclo ✅

---

## Prossime milestone

- **v1.6 — Drum Machine (FCC)**  
  9 pad interattivi con suoni e key bindings
- **v2.0 — UX & storage preferenze globali**  
  Tema, editor e ultima pagina salvata
- **v3.0 — Player lofi + auto-switch Pomodoro**  
  Audio controller e playlist dinamiche

---

## ▶️ Avvio locale

```bash
npm install
npm run dev
```
