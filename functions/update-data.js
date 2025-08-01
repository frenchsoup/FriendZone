const { Octokit } = require('@octokit/rest');

exports.handler = async function(event, context) {
  const { file, data, action, index } = JSON.parse(event.body);
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO_OWNER = 'frenchsoup';
  const REPO_NAME = 'FriendZone';
  const BRANCH = 'main';

  const octokit = new Octokit({ auth: GITHUB_TOKEN });

  try {
    // Get the current file content
    const { data: fileData } = await octokit.repos.getContent({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `data/${file}`,
      ref: BRANCH
    });

    const currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString());
    let updatedContent = data;

    // Update the file
    const message = action === 'update' ? `Update ${file}` : `Delete from ${file}`;
    await octokit.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path: `data/${file}`,
      message,
      content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64'),
      sha: fileData.sha,
      branch: BRANCH
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Error updating file:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update file' })
    };
  }
};