const { Octokit } = require('@octokit/rest');

exports.handler = async function(event, context) {
  try {
    const { file, data, action, index } = JSON.parse(event.body);
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = 'frenchsoup';
    const REPO_NAME = 'FriendZone';
    const BRANCH = 'main';

    if (!GITHUB_TOKEN) {
      console.error('GITHUB_TOKEN is not set');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server configuration error: GITHUB_TOKEN missing' })
      };
    }

    console.log('Starting function execution:', new Date());
    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Get the current file content
    console.log(`Fetching content for data/${file}`);
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `data/${file}`,
      ref: BRANCH
    });

    console.log('Fetched file content:', new Date());
    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString());
    let updatedContent = data;

    // Update the file
    const message = action === 'update' ? `Update ${file}` : `Delete from ${file}`;
    console.log(`Updating file data/${file} with action: ${action}`);
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `data/${file}`,
      message,
      content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64'),
      sha: fileData.sha,
      branch: BRANCH
    });

    console.log('File updated successfully:', new Date());
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error updating file:', error.message, error.stack);
    return {
      statusCode: error.status || 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `Failed to update file: ${error.message}` })
    };
  }
};