# Docket — deploy in ~2 minutes (free, Netlify)

## What's in this folder
- `index.html` — the whole app (timer, projects, report). PIN lock included.
- `manifest.json` + `icon-192.png` / `icon-512.png` — makes it installable on your phone.
- `service-worker.js` — lets it work offline once installed.

Your data (projects, time entries) is stored in your phone's browser storage, not sent anywhere. Nobody but someone with the link *and* your PIN can see it.

## Deploy (Netlify, no account needed to start)
1. Go to **https://app.netlify.com/drop** in a browser.
2. Drag this whole folder onto the page.
3. Netlify gives you a live URL in a few seconds, like `random-name-123.netlify.app`.
4. (Optional) Create a free Netlify account to keep the site permanently and rename the URL to something like `docket-satvik.netlify.app`. Without an account, "drop" sites can expire.

## Install on your iPhone
1. Open your new URL in **Safari** (must be Safari, not Chrome, for iOS install).
2. Tap the **Share** icon → **Add to Home Screen**.
3. It now sits on your home screen with its own icon and opens full-screen, no browser bar.

## PDF reports
The Report tab now offers both CSV and a designed PDF export (summary by project with color bars, plus a full day-by-day log). The PDF export loads a small library from the internet the first time you use it — after that it's cached and works offline too.

## First launch
You'll be asked to set a 4-digit PIN — this locks the app so the link alone isn't enough to see your data. You'll enter it each time you open Docket.

## Updating later
If you want to change anything (add a feature, adjust styling), just re-drag the updated folder onto the same Netlify site (or connect it to a GitHub repo for automatic updates) — your data stays put since it lives in the phone's browser storage, separate from the site files.
