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
├── .netlify/
│   └── functions/
│       └── update-data.js
└── sections/
    ├── admin.js
    ├── home.js
    ├── keepers.js
    ├── modal.js
    ├── payouts.js
    ├── prizes.js
    └── rules.js
```

## Tech Stack

- **Frontend**: React (via CDN), JSX, Tailwind CSS, Babel Standalone
- **Backend**: Netlify Functions ([`.netlify/functions/update-data.js`](.netlify/functions/update-data.js)), uses GitHub API to persist data
- **Data Storage**: JSON files in [`data/`](data/)
- **Styling**: Tailwind CSS, custom [`styles.css`](styles.css)
- **Deployment**: Netlify

## Setup Instructions

### Prerequisites

- **Node.js** (optional, for local development)
- **Git**
- **Netlify CLI** (optional, for local Netlify Functions: `npm install -g netlify-cli`)

### Local Development

1. Clone the repo:
    ```sh
    git clone https://github.com/frenchsoup/FriendZone.git
    cd FriendZone
    ```
2. Serve locally:
    ```sh
    npx serve .
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Netlify Functions (Optional)**:
    - Install Netlify CLI: `npm install -g netlify-cli`
    - Run: `netlify dev`
    - Test `/data/*.json` updates locally.

### Data Files

Initialize `/data/` with these JSON files (create empty versions if needed):

- `keepers_*.json`:
    ```json
    [
      {
        "team": "Team 1",
        "keeper1": "",
        "draftCost1": 0,
        "tag1": false,
        "cost1": 0,
        "keeper2": "",
        "draftCost2": 0,
        "tag2": false,
        "cost2": 0,
        "remaining": 200
      }
    ]
    ```
- `prizes_*.json`:
    ```json
    { "survivor": [], "weeklyHighScores": [] }
    ```
- `payouts.json`:
    ```json
    []
    ```
- `rules.json`:
    ```json
    { "sections": [] }
    ```
- `locks.json`:
    ```json
    { "2022": false, "2023": false, "2024": false, "2025": false }
    ```

### Netlify Function

The Netlify function ([`.netlify/functions/update-data.js`](.netlify/functions/update-data.js)) updates JSON files in the GitHub repo using the GitHub API. It supports `update` and `delete` actions for all data files.

**Environment Variable Required:**  
Set `GITHUB_TOKEN` in your Netlify site for authentication.

## Deployment to Netlify

1. Commit and push:
    ```sh
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```
2. Configure Netlify:
    - Log in at [Netlify](https://app.netlify.com/)
    - Create a new site from Git, select your repo
    - Set:
        - **Base directory**: `FriendZone`
        - **Publish directory**: `.`
        - **Build command**: _(leave blank)_
        - **Functions directory**: `.netlify/functions`
    - Add environment variable `GITHUB_TOKEN` for GitHub API access
    - Deploy the site

3. **Verify Deployment**:
    - Visit your Netlify URL
    - Open browser console for errors
    - Test admin login, keeper updates, and data persistence

## **Yearly Upgrade Checklist (example: add 2026 support)**

Follow these steps each offseason to add a new year (e.g. 2026) to the app.

- **Create data files:** Add `data/keepers_2026.json` and `data/prizes_2026.json` (use the existing 2025 files as templates). Ensure `data/locks.json` contains a `2026` key (default `false`).
- **Add defaults in app init:** Update the file-fetch list and default state in `index.html` so the app initializes `keepers[2026]` and `prizes[2026]` (use same structure as other years).
- **Update UI year selectors:** Add `2026` to any hardcoded year lists in `sections/prizes.js`, `sections/keepers.js`, and other components, or change selectors to derive years dynamically from available data files.
- **Update league/team metadata:** If teams change, update `data/league_teams.json` (add `2026` to team `years` arrays) and add an entry for `2026` in `data/yearlyawards.json` if you wish to pre-populate awards.
- **Verify persistence/backend:** The Netlify function `/.netlify/functions/update-data.js` supports arbitrary `data/*.json` files, but confirm `GITHUB_TOKEN`, `GITHUB_REPO`/owner settings, and repository permissions (repo scope) in Netlify environment variables.
- **UX and saving:** Confirm saving indicators and input disabling cover the new year (we added `isSaving` and wrapped setters for `prizes`, `payouts`, and `yearlyAwards`).
- **Test locally:** Run `netlify dev` (or serve the site) and exercise keepers/prizes/financials for 2026; verify writes update the repo and the UI (including `Financials`) reflects changes.
- **Commit & deploy:** Commit your new data files and code changes, push to GitHub, then deploy on Netlify; monitor function logs for errors and fix environment variables if needed.
- **Optional - safer workflow:** Create a dedicated branch `upgrade/2026`, push changes there, and open a PR for review before merging to `main`.

This checklist is intentionally minimal — if you want I can apply these changes now (create the 2026 files and update `index.html` and selectors) and open a PR for your review.

### Team ID migration script

To migrate existing team name references to canonical IDs (recommended):

1. Review `data/league_teams.json` and ensure each entry has an `id` field (slug-like, unique).
2. Run the migration script locally:

```bash
node scripts/migrate-teams-to-ids.js
```

The script creates `.bak` backups for any file it modifies under `data/` and replaces team name strings with the matching team `id` where possible (in `keepers_*.json`, `prizes_*.json`, and `yearlyawards.json`).

After migration, the app UI will use canonical IDs internally while showing human-friendly team names.

## Usage

- **Navigation**: Use the top bar (or hamburger menu) to switch tabs.
- **Rules**: View/edit league rules by section (admins only).
- **Payouts**: View/edit payout categories and amounts.
- **Keepers**: Select year (2022–2025), manage keepers, budgets, and lock years.
- **Prizes**: View/edit weekly high scores and survivor pool data (2023–2025).
- **Admin**: Log in to enable editing; logout to return to read-only mode.

## Contributing

1. **Fork the Repo**: Fork `frenchsoup/FriendZone` on GitHub.
2. **Make Changes**:
    - Create a feature branch: `git checkout -b feature/your-feature`
    - Update `index.html`, `styles.css`, or data files
    - Test locally with `npx serve .`
3. **Submit a Pull Request**:
    - Push your branch: `git push origin feature/your-feature`
    - Open a pull request with a clear description
4. **Code Guidelines**:
    - Use consistent JSX syntax and close all tags
    - Follow Tailwind CSS conventions
    - Use the Netlify Function for data updates
    - Test changes in the browser and check console for errors
