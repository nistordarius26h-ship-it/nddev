# Nistor Darius — Portfolio

**Live site:** [nddev.dpdns.org](https://nddev.dpdns.org)

AI & Robotics Engineer — systems that sense, think, and move. A single-page
portfolio built as a HUD/terminal-style "system" rather than a standard
resume site: boot sequence on first load, a real interactive terminal, a
world map with live-measured latency, and a schematic "site mesh" navigation
view.

## Features

- **Boot sequence** — a short terminal-style intro on first visit per session.
- **Interactive terminal** (`TERM` button) — a real command-line interface
  into the site. Type `help` for the command list. Includes a hidden
  `easteregg` command.
- **Blueprint schematic view** (`MAP` button) — flips into a full-screen
  wireframe diagram of the site's structure (sections + projects as a
  connected mesh); click any node to jump straight there.
- **Live latency world map** — pings from real, geographically distributed
  probes (via [Globalping](https://globalping.io)) to this domain, refreshed
  on a schedule via GitHub Actions and served as a static snapshot. Nodes are
  labeled "measured" when real data is available, "estimated" otherwise —
  never faked.
- **Konami code easter egg** — up up down down left right left right anywhere
  on the page (or type `easteregg` in the terminal).
- **Live sensor feed / system status** — small HUD-style readouts.
- **Certificates & skills** — highlights shown on-site, full list linked out
  to LinkedIn.

## Tech stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [react-leaflet](https://react-leaflet.js.org) / [Leaflet](https://leafletjs.com) for the world map (Esri dark basemap tiles, no API key required)
- [Radix UI](https://www.radix-ui.com) primitives + [shadcn/ui](https://ui.shadcn.com) patterns
- [lucide-react](https://lucide.dev) icons
- Deployed via GitHub Actions to GitHub Pages, on a custom domain

## Project structure

```
src/
  components/portfolio/   # All site sections + HUD widgets
  pages/Home.jsx           # Top-level page assembly
  lib/portfolioData.js     # Source of truth for terminal + map data
  index.css                # Design tokens + all custom animations
scripts/
  update-latency.mjs       # Fetches real latency via Globalping, writes public/latency.json
public/
  latency.json              # Latest latency snapshot (overwritten by the scheduled workflow)
  404.html                  # SPA deep-link redirect for GitHub Pages
.github/workflows/
  deploy.yml                 # Build + deploy to GitHub Pages
  update-latency.yml         # Scheduled: refreshes public/latency.json every 6h
```

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build to dist/
```

### Refreshing latency data manually

The live world map reads `public/latency.json`, which is normally updated
automatically every 6 hours by the `update-latency.yml` workflow. To refresh
it by hand:

```bash
node scripts/update-latency.mjs
```

Or trigger it from GitHub: Actions -> Update Real Latency Data -> Run workflow.

## Deployment

Pushes to `main` trigger `deploy.yml`, which builds the site and publishes
`dist/` to GitHub Pages. The custom domain is configured via `public/CNAME`
and DNS records with the domain registrar -- GitHub Pages settings must have
"Enforce HTTPS" enabled once DNS is verified.

## License

All rights reserved -- see [`LICENSE`](./LICENSE). This repository is public
for portfolio/demonstration purposes; it is not licensed for reuse.

## Credits

- Latency measurements: [Globalping](https://globalping.io)
- Map tiles: [Esri](https://www.esri.com), OpenStreetMap contributors
- Fonts: JetBrains Mono, Inter (Google Fonts)
