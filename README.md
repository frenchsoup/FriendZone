# FriendZone Fantasy Football League

Welcome to the **FriendZone Fantasy Football League** web app—a platform for managing your league's rules, payouts, keepers, prizes, and admin features. Built with React, Tailwind CSS, and Netlify Functions, this single-page app offers an intuitive interface for members and administrators.

## Features

- **Responsive Navigation**: Mobile-friendly tabs for Home, Rules, Payouts, Keepers, Prizes, and Admin.
- **Rules Management**: Admins can add, edit, or delete rule sections/items (stored in [`data/rules.json`](data/rules.json)).
- **Payouts Configuration**: View/edit payout categories, percentages, and prize amounts ([`data/payouts.json`](data/payouts.json)).
- **Keeper Tracking**: Manage keeper players, draft costs, tags, and budgets for 2022–2025 ([`data/keepers_2022.json`](data/keepers_2022.json), [`data/keepers_2023.json`](data/keepers_2023.json), [`data/keepers_2024.json`](data/keepers_2024.json), [`data/keepers_2025.json`](data/keepers_2025.json)).
- **Prize Tracking**: Record weekly high scores and survivor pool results for 2023–2025 ([`data/prizes_2023.json`](data/prizes_2023.json), [`data/prizes_2024.json`](data/prizes_2024.json), [`data/prizes_2025.json`](data/prizes_2025.json)).
- **Admin Authentication**: Password-protected admin login with data editing and locking ([`sections/admin.js`](sections/admin.js)).
- **Data Persistence**: Netlify Function ([`.netlify/functions/update-data.js`](.netlify/functions/update-data.js)) for reading/writing JSON files via GitHub API.
- **Modal Confirmations**: Safe deletion of rules/sections ([`sections/modal.js`](sections/modal.js)).
- **Styling**: Responsive design with Tailwind CSS and custom [`styles.css`](styles.css).

## Project Structure

## Recent Changes (Dec 17, 2025)

- Added a small SVG favicon (`/favicon.svg`) and linked it in `index.html` to avoid a missing favicon error.
- Improved Netlify persistence function `.netlify/functions/update-data.js`: fetches latest file SHA before updates, retries on 409 conflicts, and uses a dynamic import to support the modern ESM `@octokit` package. Function now checks for `GITHUB_TOKEN` and supports `DEBUG_FUNCTIONS=true` for richer error output.
- Introduced canonical team `id`s in `data/league_teams.json` and added `window.AppState` helpers (`getTeamById`, `getTeamIdByName`, `getTeamsForYear`, `normalizeTeamName`). The UI now prefers IDs internally while displaying friendly names.
- New scripts:
    - `scripts/migrate-teams-to-ids.js` — one-time migration tool to convert team names to canonical IDs (creates `.bak` backups when run).
    - `scripts/compute_financials.js` — local verification script that reproduces the `Financials` calculations for debugging payouts.
- UI updates:
    - `sections/financials.js`: top 5 earners shown in a left leaderboard column; improved mobile/table styling (sticky headers, right-aligned numeric columns, compact mobile cards); fixed weekly-high-score payout calculation to use per-week amount derived from the total WHS pool.
    - `sections/prizes.js` and `sections/keepers.js`: use canonical team IDs in selects and normalize before persisting.
- UX: added global `isSaving` flag and wrapped setters for `prizes`, `payouts`, and `yearlyAwards` so inputs disable during saves and show saving state.

```
FriendZone/
├── index.html
├── styles.css
├── netlify.toml
├── LICENSE
├── package.json
├── README.md
├── data/
│   ├── keepers_2022.json
│   ├── keepers_2023.json
│   ├── keepers_2024.json
│   ├── keepers_2025.json
│   ├── locks.json
│   ├── payouts.json
│   ├── prizes_2023.json
│   ├── prizes_2024.json
│   ├── prizes_2025.json
│   └── rules.json
# FriendZone Fantasy Football League

A lightweight single-page web app for managing a fantasy football league: rules, payouts, keepers, weekly prizes, and simple admin tools.

Built with React (via CDN), Tailwind CSS, and Netlify Functions. Data is stored as JSON files under `/data/` and persisted back to the repository via a Netlify Function that uses the GitHub API.

## Quick Start

1. Clone the repository:

```bash
git clone https://github.com/frenchsoup/FriendZone.git
cd FriendZone
```

2. Serve the site locally (static server):

```bash
npx serve .
```

Open http://localhost:3000 in your browser.

3. (Optional) To run Netlify functions locally, install the Netlify CLI and run `netlify dev`.

## What’s in the repo

- `index.html` — app bootstrap and global state
- `styles.css` — custom styles
- `sections/` — UI sections (home, keepers, prizes, payouts, admin, financials, etc.)
- `data/` — JSON data files (keepers, prizes, payouts, yearlyawards, league_teams, locks, rules)
- `.netlify/functions/update-data.js` — Netlify Function that persists JSON files to GitHub
- `scripts/` — developer scripts (migration and verification tools)

## Data layout

- `data/league_teams.json` — canonical list of teams (each entry includes an `id`, `team` display name, and `years` array)
- `data/keepers_YYYY.json` — keeper info per year
- `data/prizes_YYYY.json` — weeklyHighScores and survivor entries per year
- `data/payouts.json` — payout categories and prize amounts
- `data/yearlyawards.json` — yearly award winners

The UI prefers canonical `id` values for internal comparisons but displays the `team` name for users.

## Netlify function & GitHub persistence

The Netlify function at `.netlify/functions/update-data.js` handles saving JSON back to GitHub. When deploying, set the `GITHUB_TOKEN` environment variable in Netlify with a token that has repository write access.

Notes:
- The function fetches the file's latest SHA before updating to avoid GitHub 409 conflicts.
- If you see a 409 on updates, retrying after fetching the latest SHA resolves it.

## Admin & editing

- Admin actions are protected by a simple password (see `index.html` for the value used in this build). Admins can edit keepers, prizes, payouts, and rules.
- While saving, inputs are disabled and a global `isSaving` flag prevents concurrent edits.

## Responsive & UI notes

- The Financials tab displays a compact leaderboard and a responsive table. Numeric columns are right-aligned and headers are sticky for easier mobile viewing.

## Deploying to Netlify

1. Push your branch to the repository:

```bash
git add .
git commit -m "Your message"
git push origin main
```

2. In Netlify, create a new site from Git and point it to this repository. Set the Functions directory to `.netlify/functions` and add the `GITHUB_TOKEN` environment variable.

## Contributing

1. Fork the repo and create a branch for your changes.
2. Keep changes small and focused. Run the site locally to verify behavior.
3. Open a PR with a clear description of your changes.

If you want me to create a PR with today's updates (Netlify function fixes, team ID work, favicon, UI adjustments), I can prepare one.

---
Simple, focused, and ready for local testing — let me know if you want the README to include developer commands (install dependencies, linting, tests) or a diagram of data flow.
