// Netlify function: update/delete JSON files in the repo using GitHub API
// Uses dynamic import for @octokit/rest to support ESM packages.

const OWNER_REPO = process.env.GITHUB_REPO || 'frenchsoup/FriendZone';
const [DEFAULT_OWNER, DEFAULT_REPO] = OWNER_REPO.split('/');
const DEFAULT_BRANCH = process.env.GITHUB_BRANCH || 'main';

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

exports.handler = async function (event) {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

    const body = JSON.parse(event.body || '{}');
    const { file, data, action, index } = body;
    if (!file) return { statusCode: 400, body: 'Missing file param' };

    // Basic diagnostics
    console.info('update-data called', { file, action, index });

    if (!process.env.GITHUB_TOKEN) {
      const msg = 'GITHUB_TOKEN not set in environment';
      console.error(msg);
      return { statusCode: 500, body: JSON.stringify({ error: msg }) };
    }

    const owner = process.env.GITHUB_OWNER || DEFAULT_OWNER;
    const repo = process.env.GITHUB_REPO_NAME || DEFAULT_REPO;
    const branch = process.env.GITHUB_BRANCH || DEFAULT_BRANCH;
    const path = `data/${file}`;

    let Octokit;
    try {
      ({ Octokit } = await import('@octokit/rest'));
    } catch (impErr) {
      console.error('Failed to import @octokit/rest', impErr);
      throw impErr;
    }
    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    async function getLatestSha() {
      try {
        const resp = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        return resp.data && resp.data.sha ? resp.data.sha : null;
      } catch (err) {
        if (err.status === 404) return null;
        throw err;
      }
    }

    async function updateFileWithRetry(contentB64, message, maxRetries = 4) {
      let attempt = 0;
      while (attempt < maxRetries) {
        try {
          const sha = await getLatestSha();
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

    if (action === 'delete') {
      const sha = await getLatestSha();
      if (!sha) return { statusCode: 404, body: 'File not found' };
      await octokit.repos.deleteFile({ owner, repo, path, message: `Delete ${file} via Netlify function`, sha, branch });
      return { statusCode: 200, body: JSON.stringify({ ok: true }) };
    }

    // default: update/create
    let updatedContent = data;

    // support some delete-by-index actions for arrays or rules structure
    if (action === 'delete-item' && typeof index !== 'undefined') {
      // fetch current content
      let current;
      try {
        const resp = await octokit.repos.getContent({ owner, repo, path, ref: branch });
        current = JSON.parse(Buffer.from(resp.data.content, 'base64').toString());
      } catch (err) {
        if (err.status === 404) current = Array.isArray(data) ? [] : {};
        else throw err;
      }
      if (Array.isArray(current)) {
        updatedContent = current.filter((_, i) => i !== index);
      } else if (index && typeof index.sectionIndex === 'number' && typeof index.itemIndex === 'number') {
        updatedContent = { ...current };
        updatedContent.sections[index.sectionIndex].items.splice(index.itemIndex, 1);
      } else if (index && typeof index.sectionIndex === 'number') {
        updatedContent = { ...current };
        updatedContent.sections.splice(index.sectionIndex, 1);
      } else {
        throw new Error('Invalid delete-item action');
      }
    }

    const contentStr = typeof updatedContent === 'string' ? updatedContent : JSON.stringify(updatedContent, null, 2);
    const contentB64 = Buffer.from(contentStr).toString('base64');
    const message = `Update ${file} via Netlify function`;

    await updateFileWithRetry(contentB64, message, 4);

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('Error in update-data:', err);
    const status = err.status || 500;
    const message = err.message || 'Unknown error';
    const debug = process.env.DEBUG_FUNCTIONS === 'true';
    const body = debug ? { error: message, stack: err.stack } : { error: message };
    return { statusCode: status, body: JSON.stringify(body) };
  }
};