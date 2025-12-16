const { Octokit } = require('@octokit/rest');

const OWNER_REPO = process.env.GITHUB_REPO || 'frenchsoup/FriendZone';
const [DEFAULT_OWNER, DEFAULT_REPO] = OWNER_REPO.split('/');
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || 'main';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getLatestSha(owner, repo, path, branch = DEFAULT_BRANCH) {
  try {
    const resp = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    return resp.data && resp.data.sha ? resp.data.sha : null;
  } catch (err) {
    if (err.status === 404) return null;
    throw err;
  }
}

async function updateFileWithRetry({ owner, repo, path, contentB64, message, branch = DEFAULT_BRANCH, maxRetries = 3 }) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const sha = await getLatestSha(owner, repo, path, branch);
      const params = { owner, repo, path, message, content: contentB64, branch };
      if (sha) params.sha = sha;
      await octokit.repos.createOrUpdateFileContents(params);
      return;
    } catch (err) {
      if (err.status === 409) {
        attempt++;
        await wait(150 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw new Error('Failed to update file after retries due to conflicts');
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const body = JSON.parse(event.body || '{}');
    const { file, data, action } = body;
    if (!file) return { statusCode: 400, body: 'Missing file param' };

    const owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
    const repo = process.env.GITHUB_REPO_NAME || DEFAULT_REPO;
    const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
    const path = `data/${file}`;

    if (action === 'delete') {
      const sha = await getLatestSha(owner, repo, path, branch);
      if (!sha) return { statusCode: 404, body: 'File not found' };
      await octokit.repos.deleteFile({ owner, repo, path, message: `Delete ${file} via Netlify function`, sha, branch });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // default: update/create
    const contentStr = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
    const contentB64 = Buffer.from(contentStr).toString('base64');
    const message = `Update ${file} via Netlify function`;

    await updateFileWithRetry({ owner, repo, path, contentB64, message, branch, maxRetries: 4 });

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Error in update-data:', err);
    const status = err.status || 500;
    const message = err.message || 'Unknown error';
    return { statusCode: status, body: JSON.stringify({ error: message }) };
  }
};
async function loadOctokit() {
  const { Octokit } = await import('@octokit/rest');
  return Octokit;
}

exports.handler = async function (event, context) {
  try {
    const { file, data, action, index } = JSON.parse(event.body);
    const Octokit = await loadOctokit();
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const repoOwner = 'frenchsoup';
    const repoName = 'FriendZone';
    const branch = 'main';
    const path = `data/${file}`;

    let currentContent;
    let sha;
    try {
      const { data: fileData } = await octokit.repos.getContent({
        owner: repoOwner,
        repo: repoName,
        path,
        ref: branch,
      });
      currentContent = JSON.parse(Buffer.from(fileData.content, 'base64').toString());
      sha = fileData.sha;
    } catch (error) {
      if (error.status === 404) {
        currentContent = file === 'locks.json' ? { 2022: false, 2023: false, 2024: false, 2025: false } : Array.isArray(data) ? [] : {};
      } else {
        throw error;
      }
    }

    let updatedContent;
    if (action === 'update') {
      updatedContent = data;
    } else if (action === 'delete') {
      if (Array.isArray(currentContent)) {
        updatedContent = currentContent.filter((_, i) => i !== index);
      } else if (index && typeof index.sectionIndex === 'number' && typeof index.itemIndex === 'number') {
        updatedContent = { ...currentContent };
        updatedContent.sections[index.sectionIndex].items.splice(index.itemIndex, 1);
      } else if (index && typeof index.sectionIndex === 'number') {
        updatedContent = { ...currentContent };
        updatedContent.sections.splice(index.sectionIndex, 1);
      } else {
        throw new Error('Invalid delete action');
      }
    } else {
      throw new Error('Invalid action');
    }

    const { data: commitData } = await octokit.repos.createOrUpdateFileContents({
      owner: repoOwner,
      repo: repoName,
      path,
      message: `Update ${file} via Netlify function`,
      content: Buffer.from(JSON.stringify(updatedContent, null, 2)).toString('base64'),
      branch,
      sha: sha || undefined,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'File updated successfully', commit: commitData.commit.sha }),
    };
  } catch (error) {
    console.error('Error in update-data:', error);
    return {
      statusCode: error.status || 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
};