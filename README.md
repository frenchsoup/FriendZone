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
