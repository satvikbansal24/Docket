# Docket — personal time & billing tracker

## What's in this folder
- `index.html` — the whole app (timer, projects, report).
- `manifest.json` + `icon-192.png` / `icon-512.png` — makes it installable on your phone.
- `service-worker.js` — lets it work offline once installed, and checks for updates on every launch.
- `netlify/functions/ask-ai.js` + `package.json` — a small serverless function that powers the "Ask AI" button on the Projects tab. Requires Netlify to be connected to this GitHub repo (not the drag-and-drop deploy method) and an `ANTHROPIC_API_KEY` environment variable set on the Netlify site.

Your data (projects, time entries) is stored in your phone's browser storage, not sent anywhere. When you use "Ask AI" to draft a project, only the text you type into that box is sent to Anthropic's API — none of your existing projects or time entries.

## Deploy (Netlify, connected to GitHub)
1. Go to **app.netlify.com**, sign in with GitHub.
2. **Add new project → Import an existing project → GitHub** → pick this repo.
3. Leave build settings at their defaults (no build command needed) → Deploy.
4. To enable "Ask AI": in the site's **Project configuration → Environment variables**, add `ANTHROPIC_API_KEY` with a key from console.anthropic.com. Without this, everything else in the app works fine — the Ask AI button will just show an error if used.

Every push to `main` on GitHub redeploys the site automatically.

## Install on your iPhone
1. Open your site's URL in **Safari** (must be Safari, not Chrome, for iOS install).
2. Tap the **Share** icon → **Add to Home Screen**.
3. It now sits on your home screen with its own icon and opens full-screen, no browser bar.

## Reports
The Report tab offers CSV export, a designed PDF export (loads a small library from the internet the first time, then works offline), and a Backup & restore section — download your data as a JSON file, or restore from one. Since your data only lives in this browser's storage, a periodic backup is the only copy that survives clearing site data or switching devices.
