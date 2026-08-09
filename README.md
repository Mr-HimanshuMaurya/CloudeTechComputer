# Cloud Tech Computer — Website

Multi-page company website built with Vite + React, Tailwind CSS v4, GSAP,
Framer Motion, Three.js and lucide-react.

## Tech stack

- **Vite + React 19** — build tooling and UI
- **Tailwind CSS v4** — styling, custom theme tokens in `src/index.css`
- **React Router v7** — client-side routing (Home / About / Services / Team / Contact)
- **GSAP + ScrollTrigger** — scroll-reveal animations (`src/components/Reveal.jsx`)
- **Framer Motion** — page transitions, mobile menu, hero micro-interactions
- **Three.js** — animated network topology in the hero (`src/three/NetworkScene.jsx`)
- **lucide-react** — all icons

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview   # to test the production build locally
```

The production build is output to `dist/`. Upload the contents of `dist/`
to any static host (Vercel, Netlify, Hostinger, your own VPS with nginx, etc).
Because this is a client-side-routed single-page app, configure your host to
redirect all unmatched routes to `index.html` (a "SPA fallback" / rewrite rule),
otherwise refreshing on `/services` or `/team` directly will 404.

- **Netlify**: add a `_redirects` file in `public/` with `/* /index.html 200`
- **Vercel**: works out of the box for Vite SPAs
- **nginx**: `try_files $uri /index.html;` in your location block

## Editing content

All company copy — services, team bios, stats, contact details — lives in
one file:

```
src/data/content.js
```

Edit names, roles, bios, service descriptions, phone/email there. No need to
touch component files for content changes.

## Editing the theme

Colors, fonts and spacing tokens are defined at the top of:

```
src/index.css
```

under the `@theme { ... }` block. Change `--color-signal`, `--color-violet`,
etc. to retheme the whole site — every component reads from these tokens.

## Project structure

```
src/
  components/   Navbar, Footer, Reveal (scroll animation), cards, PageShell
  pages/        Home, About, Services, Team, Contact
  three/        NetworkScene.jsx — the Three.js hero background
  data/         content.js — all site copy in one place
  index.css     Tailwind import + design tokens + utility classes
```

## Notes

- Google Fonts (Space Grotesk / Inter / JetBrains Mono) are loaded via
  `<link>` tags in `index.html`. If you'd rather self-host them, download
  the font files and swap the `<link>` tags for local `@font-face` rules —
  fallback system fonts are already wired up so nothing breaks either way.
- Reduced-motion is respected throughout (GSAP, Three.js and CSS all check
  `prefers-reduced-motion`).
- The contact form currently only shows a local "sent" confirmation — it
  doesn't send email yet. Wire it to a backend, Formspree, or an API route
  before going live.
