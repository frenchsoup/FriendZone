FriendZone Fantasy Football League
==================================

Welcome to the **FriendZone Fantasy Football League** web application, a platform for managing your fantasy football league's rules, payouts, keepers, prizes, and admin features. Built with React, Tailwind CSS, and Netlify Functions, this single-page app provides an intuitive interface for league members to view data and administrators to manage settings.

Features
--------

*   **Responsive Navigation**: Mobile-friendly navigation with tabs for Home, Rules, Payouts, Keepers, Prizes, and Admin.
    
*   **Rules Management**: Admins can add, edit, or delete rule sections and items, stored in rules.json.
    
*   **Payouts Configuration**: View and edit payout categories, percentages, and prize amounts, stored in payouts.json.
    
*   **Keeper Tracking**: Manage keeper players, draft costs, tags, and remaining auction budgets for multiple years (2022–2025), stored in keepers\_.json.
    
*   **Prize Tracking**: Record weekly high scores and survivor pool eliminations/winners for 2023–2025, stored in prizes\_.json.
    
*   **Admin Authentication**: Secure admin access with a password-protected login, enabling data editing and locking mechanisms.
    
*   **Data Persistence**: Uses Netlify Functions to read/write JSON data files, ensuring persistent storage.
    
*   **Modal Confirmations**: Delete rules or sections with confirmation modals for safety.
    
*   **Styling**: Responsive design with Tailwind CSS and custom styles in styles.css for tables, cards, and inputs.
    

Tech Stack
----------

*   **Frontend**: React (18.2.0), JSX, Tailwind CSS, Babel Standalone (7.23.2)
    
*   **Backend**: Netlify Functions for data updates (/.netlify/functions/update-data)
    
*   **Data Storage**: JSON files (/data/\*.json) hosted on Netlify
    
*   **Styling**: Tailwind CSS, custom styles.css, Inter font via Google Fonts
    
*   **Deployment**: Netlify
    

Setup Instructions
------------------

### Prerequisites

*   **Node.js**: Required for local development (optional for Netlify deployment).
    
*   **Git**: For cloning and managing the repository.
    
*   **Netlify CLI**: Optional for local testing of Netlify Functions (npm install -g netlify-cli).
    

### Local Development

1.  git clone https://github.com/frenchsoup/FriendZone.gitcd FriendZone
    
2.  FriendZone/├── data/│ ├── keepers\_2022.json│ ├── keepers\_2023.json│ ├── keepers\_2024.json│ ├── keepers\_2025.json│ ├── prizes\_2023.json│ ├── prizes\_2024.json│ ├── prizes\_2025.json│ ├── payouts.json│ ├── rules.json│ └── locks.json├── .netlify/│ └── functions/│ └── update-data.js├── index.html├── styles.css├── netlify.toml└── README.md
    
3.  
4.  npx serve .Open http://localhost:3000 (or the provided port) in your browser. Check the console (F12 > Console) for errors.
    
5.  **Netlify Functions (Optional)**:To test data updates locally:
    
    *   Install Netlify CLI: npm install -g netlify-cli
        
    *   Run: netlify dev
        
    *   This starts a local server with Netlify Functions support, allowing you to test /data/\*.json updates.
        

### Data Files

Initialize the /data/ directory with the following JSON files (create empty versions if needed):

*   \[ {"team": "Team 1", "keeper1": "", "draftCost1": 0, "tag1": false, "cost1": 0, "keeper2": "", "draftCost2": 0, "tag2": false, "cost2": 0, "remaining": 200}, ...\]
    
*   {"survivor": \[\], "weeklyHighScores": \[\]}
    
*   \[\]
    
*   {"sections": \[\]}
    
*   {"2022": false, "2023": false, "2024": false, "2025": false}
    

### Netlify Function

Ensure the /.netlify/functions/update-data.js file exists for data persistence. A basic implementation:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   const fs = require('fs').promises;  const path = require('path');  exports.handler = async (event) => {    try {      const { file, data, action, index } = JSON.parse(event.body);      const filePath = path.join(__dirname, '../../data', file);      let currentData = [];      try {        currentData = JSON.parse(await fs.readFile(filePath));      } catch (err) {        // File may not exist yet      }      if (action === 'update') {        await fs.writeFile(filePath, JSON.stringify(data, null, 2));      } else if (action === 'delete' && index != null) {        currentData.splice(index, 1);        await fs.writeFile(filePath, JSON.stringify(currentData, null, 2));      }      return {        statusCode: 200,        body: JSON.stringify({ success: true })      };    } catch (err) {      return {        statusCode: 500,        body: JSON.stringify({ error: err.message })      };    }  };   `

Deployment to Netlify
---------------------

1.  git add .git commit -m "Initial commit"git push origin main
    
2.  **Configure Netlify**:
    
    *   Log in to [Netlify](https://app.netlify.com/).
        
    *   Create a new site from Git, selecting your frenchsoup/FriendZone repository.
        
    *   Set the build settings:
        
        *   **Base directory**: FriendZone
            
        *   **Publish directory**: . (root)
            
        *   **Build command**: Leave blank (no build required for static site).
            
        *   **Functions directory**: .netlify/functions
            
    *   Deploy the site. The URL will be something like https://friendzoneff.netlify.app.
        
3.  **Environment Variables**:
    
    *   The app uses a hardcoded admin password (friendzone2025). For security, move it to a Netlify environment variable:
        
        *   Go to Site Settings > Environment Variables in Netlify.
            
        *   Add ADMIN\_PASSWORD with the value friendzone2025.
            
        *   Update index.html to fetch the password via a Netlify Function (contact for assistance).
            
4.  **Verify Deployment**:
    
    *   Visit your Netlify URL (e.g., https://friendzoneff.netlify.app).
        
    *   Open the browser console (F12 > Console) to check for errors.
        
    *   Test admin login, keeper updates, and data persistence.
        

Usage
-----

1.  **Navigation**:
    
    *   Use the top navigation bar (or hamburger menu on mobile) to switch between tabs: Home, Rules, Payouts, Keepers, Prizes, Admin.
        
    *   The Home tab provides a welcome message.
        
    *   The Admin tab requires a password (friendzone2025 by default).
        
2.  **Rules**:
    
    *   View league rules organized by sections.
        
    *   Admins can add/edit/delete sections and rules via inline forms or modals.
        
3.  **Payouts**:
    
    *   View payout categories, pot percentages, and prize amounts.
        
    *   Admins can add/edit/delete payouts via inline inputs.
        
4.  **Keepers**:
    
    *   Select a year (2022–2025) to view/edit keeper data.
        
    *   Each team can have two keepers with draft costs, tags (franchise/designated), and calculated costs.
        
    *   Budget is $200 per team; updates are saved via a Save button unless the year is locked.
        
    *   Admins can lock/unlock years to prevent edits.
        
5.  **Prizes**:
    
    *   Select a year (2023–2025) to view weekly high scores and survivor pool data.
        
    *   Admins can add/edit/delete entries for weekly scores (weeks 1–14) and survivor eliminations/winners (weeks 1–12).
        
6.  **Admin**:
    
    *   Log in with the admin password to enable editing across all tabs.
        
    *   Logout via the navigation bar to return to read-only mode.
        

Contributing
------------

1.  **Fork the Repository**:
    
    *   Fork frenchsoup/FriendZone on GitHub.
        
2.  **Make Changes**:
    
    *   Create a feature branch: git checkout -b feature/your-feature.
        
    *   Update index.html, styles.css, or data files as needed.
        
    *   Test locally with npx serve ..
        
3.  **Submit a Pull Request**:
    
    *   Push your branch: git push origin feature/your-feature.
        
    *   Open a pull request with a clear description of changes.
        
4.  **Code Guidelines**:
    
    *   Use consistent JSX syntax and close all tags.
        
    *   Follow Tailwind CSS conventions for styling.
        
    *   Ensure data updates use the update-data Netlify Function.
        
    *   Test all changes in the browser and check console for errors.
        

Troubleshooting
---------------

*   **JSX Errors**: If you see errors like "JSX element has no corresponding closing tag", check index.html for unclosed tags or missing React Fragments (<>). Use VS Code’s Problems panel for diagnostics.
    
*   **Netlify Function Errors**: Check Netlify’s Functions logs if data updates fail. Ensure /.netlify/functions/update-data.js is correctly configured.
    
*   **Styles Not Applying**: Verify styles.css loads in the browser’s Network tab (F12 > Network). Check the  path (/styles.css) matches your Netlify setup.
    
*   **Data Not Loading**: Ensure /data/\*.json files exist and are readable. Check Netlify’s Deploy logs for file access issues.