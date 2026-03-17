# Portfolio – versione Vanilla (HTML / CSS / JS)

Versione **brutalist** del portfolio in HTML/CSS/JS puro, 1:1 con la versione React (stesso aspetto e stesse funzionalità, senza React né GSAP).

## File

- **index.html** – Struttura (noise, cursor, scroll bar, header, hero con tape, sezioni, footer)
- **style.css** – Tema brutalist (variabili, nav, hero, tape, sezioni, card, reveal on scroll)
- **script.js** – Cursor, scroll progress, rendering da data, header/menu, reveal, tilt card
- **data.js** – Dati (personal, projects, skills, highlights, contactLinks)

## Come avviare

Apri **index.html** nel browser (doppio clic) oppure con un server locale:

```bash
cd vanilla
npx serve .
```

Poi apri l’URL indicato (es. http://localhost:3000).

## Funzionalità (1:1 con React)

- Cursor personalizzato che segue il mouse e si ingrandisce su link/button
- Barra di scroll in alto che si riempie con lo scroll
- Overlay noise (grana)
- Nav fissa, stato “scrolled”, menu mobile (☰/✕)
- Hero: ghost “PORTFOLIO”, titolo, tagline, CTA, nastro a scorrimento (due copie, loop senza vuoti)
- About: ghost “ABOUT”, header, 4 card colorate con reveal
- Projects: ghost “WORK”, featured + 3 card, tilt 3D al passaggio del mouse, reveal
- Skills: ghost “SKILLS”, griglia card con reveal
- Contact: ghost “CONTACT”, titolo, 3 link CTA con reveal
- Footer: logo nome con stroke, copyright
- Reveal on scroll (IntersectionObserver) con classi .brutal-reveal e .brutal-revealed
- Smooth scroll per navigazione

## Aggiornare i contenuti

Modifica **data.js** (personal, projects, skills, highlights, contactLinks). Per le card About il testo è in script.js (aboutHighlights) se vuoi cambiare titoli/descrizioni/tag.
