# NEXORA LocalLift

A responsive, browser-only digital-presence self-assessment for small and local businesses. It converts a short set of answers into a readiness score, category breakdown and practical next-step list.

## Features

- Business snapshot and goal selection.
- 11 questions across website experience, discovery, trust and conversion.
- Transparent weighted score out of 100.
- Prioritised recommendations based on answers.
- Downloadable plain-text report and print-friendly layout.
- Responsive black-and-orange NEXORA AI styling.
- No account, backend, API key, analytics or paid service.

## Run locally

No build tools or dependencies are required.

1. Download or clone this repository.
2. Open the `nexora-locallift` folder.
3. Open `index.html` in a modern browser.

For a local development server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000` and open the app if your server is started from the repository root, or run the command from this folder.

## Deploy to Vercel

1. Import `yusufquadri786/yusuf` into Vercel.
2. Select the branch `feat/nexora-locallift` for a preview deployment.
3. Set **Root Directory** to `nexora-locallift`.
4. Choose **Other** as the framework preset.
5. Leave build and install commands empty.
6. Use `.` as the output directory if Vercel asks for one.
7. Review the preview before promoting or connecting a production domain.

The app is static; it does not require environment variables or a server function.

## Scoring

Each category is worth 25 points. A Yes answer earns full points, Partly earns half points, and No earns zero. The score is a planning aid based only on the answers supplied.

## Privacy and limitations

- All answers are processed in the browser.
- The app does not submit information to a server.
- It does not visit, crawl or technically scan a website.
- It does not check search rankings, real customer reviews or business-profile ownership.
- Do not enter private customer information.
- The score is not a guarantee of leads, sales, search ranking or business performance.

## Files

- `index.html` — accessible form and results layout.
- `styles.css` — responsive interface and print styling.
- `app.js` — scoring, recommendations and report export.
- `PROJECT-BRIEF.md` — product goals, scoring model and acceptance checks.
