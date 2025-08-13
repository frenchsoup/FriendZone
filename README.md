# FriendZone Fantasy Football League

Welcome to the **FriendZone Fantasy Football League** web app—a platform for managing your league's rules, payouts, keepers, prizes, and admin features. Built with React, Tailwind CSS, and Netlify Functions, this single-page app offers an intuitive interface for members and administrators.

## Features

- **Responsive Navigation**: Mobile-friendly tabs for Home, Rules, Payouts, Keepers, Prizes, and Admin.
- **Rules Management**: Admins can add, edit, or delete rule sections/items (stored in `rules.json`).
- **Payouts Configuration**: View/edit payout categories, percentages, and prize amounts (`payouts.json`).
- **Keeper Tracking**: Manage keeper players, draft costs, tags, and budgets for 2022–2025 (`keepers_*.json`).
- **Prize Tracking**: Record weekly high scores and survivor pool results for 2023–2025 (`prizes_*.json`).
- **Admin Authentication**: Password-protected admin login with data editing and locking.
- **Data Persistence**: Netlify Functions for reading/writing JSON files.
- **Modal Confirmations**: Safe deletion of rules/sections.
- **Styling**: Responsive design with Tailwind CSS and custom styles.

## Tech Stack

- **Frontend**: React (18.2.0), JSX, Tailwind CSS, Babel Standalone
- **Backend**: Netlify Functions (`/.netlify/functions/update-data`)
- **Data Storage**: JSON files (`/data/*.json`) on Netlify
- **Styling**: Tailwind CSS, custom `styles.css`, Inter font (Google Fonts)
- **Deployment**: Netlify

## Setup Instructions

### Prerequisites

- **Node.js**: For local development (optional for Netlify deployment)
- **Git**: For cloning/managing the repo
- **Netlify CLI**: Optional for local Netlify Functions (`npm install -g netlify-cli`)

### Local Development

1. Clone the repo:
    ```sh
    git clone https://github.com/frenchsoup/FriendZone.git
    cd FriendZone
    ```
2. Project structure:
    ```
    FriendZone/
    ├── data/
    │   ├── keepers_2022.json
    │   ├── keepers_2023.json
    │   ├── keepers_2024.json
    │   ├── keepers_2025.json
    │   ├── prizes_2023.json
    │   ├── prizes_2024.json
    │   ├── prizes_2025.json
    │   ├── payouts.json
    │   ├── rules.json
    │   └── locks.json
    ├── .netlify/
    │   └── functions/
    │       └── update-data.js
    ├── index.html
    ├── styles.css
    ├── netlify.toml
    └── README.md
    ```
3. Serve locally:
    ```sh
    npx serve .
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Netlify Functions (Optional)**:
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

Ensure `/.netlify/functions/update-data.js` exists for data persistence. Example implementation:

```js
const fs = require('fs').promises;
const path = require('path');

exports.handler = async (event) => {
  try {
    const { file, data, action, index } = JSON.parse(event.body);
    const filePath = path.join(__dirname, '../../data', file);
    let currentData = [];
    try {
      currentData = JSON.parse(await fs.readFile(filePath));
    } catch (err) {
      // File may not exist yet
    }
    if (action === 'update') {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } else if (action === 'delete' && index != null) {
      currentData.splice(index, 1);
      await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));
    }
    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
```

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
    - Deploy the site (URL like `https://friendzoneff.netlify.app`)

3. **Environment Variables**:
    - Move the admin password to a Netlify environment variable:
        - Site Settings > Environment Variables
        - Add `ADMIN_PASSWORD` with value `friendzone2025`
        - Update `index.html` to fetch password via Netlify Function (contact for help)

4. **Verify Deployment**:
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