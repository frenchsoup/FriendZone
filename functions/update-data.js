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