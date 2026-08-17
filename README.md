# Nistor Darius — Portfolio

A standalone React + Vite portfolio site (exported from Base44 and stripped
of all Base44-specific dependencies so it can run and be hosted anywhere,
including GitHub Pages).

## What was changed from the Base44 export

- Removed `@base44/sdk` and `@base44/vite-plugin` (and the plugin call in
  `vite.config.js`, which referenced an import that no longer exists).
- Removed the login/register/OAuth/auth-gate screens and `AuthContext` —
  they called a Base44 backend endpoint (`/api/apps/public/...`) that
  doesn't exist outside Base44 hosting. This site never actually used auth
  or any Base44 entity/data — every page is fully static — so `App.jsx` now
  just renders the site directly.
- Removed the unused `src/api/base44Client.js` stub.
- Reconstructed the proper `src/` folder structure (the zip export flattens
  every file into one folder; imports like `@/components/ui/button` map to
  `src/components/ui/button.jsx`, etc.).
- Set `base: './'` in `vite.config.js` so the built assets use relative
  paths and work under any GitHub Pages subpath without extra config.
- Added a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
  builds and deploys to GitHub Pages automatically on every push to `main`.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output goes to `dist/`.

## Deploy to GitHub Pages

**Option A — GitHub Actions (recommended, already set up):**

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to
   **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).
   The site will build and publish automatically.

**Option B — `gh-pages` package:**

```bash
npm run deploy
```

This builds the site and pushes `dist/` to a `gh-pages` branch. Then in
**Settings → Pages**, set **Source** to the `gh-pages` branch.

## Notes

- This is a single-page app with only one real route (`/`). If you add more
  routes later and use GitHub Pages (which has no server-side routing),
  add a `404.html` that redirects back to `index.html` so deep links don't
  404 on refresh.
