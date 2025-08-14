exports.handler = async function (event) {
  try {
    const { Octokit } = await import('@octokit/rest');
    const { filename } = event.queryStringParameters;
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    const repoOwner = 'frenchsoup';
    const repoName = 'FriendZone';
    const path = `data/${filename}`;

    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path,
      });
      const content = Buffer.from(fileData.content, 'base64').toString();
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: content,
      };
    } catch (error) {
      if (error.status === 404) {
        const defaultContent =
          filename === 'locks.json' ? { 2022: false, 2023: false, 2024: false, 2025: false } :
          filename === 'rules.json' ? { sections: [] } :
          filename === 'payouts.json' ? [] :
          filename.startsWith('keepers_') ? { teams: [] } :
          filename.startsWith('prizes_') ? { weeklyHighScores: [], survivor: [] } : {};
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(defaultContent),
        };
      }
      throw error;
    }
  } catch (error) {
    console.error('Error in get-data:', error);
    return {
      statusCode: error.status || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};