const axios = require('axios');

const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${process.env.GITHUB_PERSONAL_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
  },
});

// Parse a GitHub URL into owner and repo name.
function parseGitHubUrl(url) {

  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
  }
  return {
    owner: match[1],
    repo: match[2].replace('.git', ''), // Remove .git suffix if present
  };
}

/**
 * Fetch the complete file tree of a repository.
 */
async function getRepoTree(owner, repo) {
  const repoInfo = await githubClient.get(`/repos/${owner}/${repo}`);
  const defaultBranch = repoInfo.data.default_branch; // e.g., "main"

  const branchInfo = await githubClient.get(
    `/repos/${owner}/${repo}/branches/${defaultBranch}`
  );
  const treeSha = branchInfo.data.commit.commit.tree.sha;

  const treeResponse = await githubClient.get(
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
  );

  return treeResponse.data.tree; // Array of { path, type, sha, size }
}

/**
 * Fetch the content of a single file.
 */
async function getFileContent(owner, repo, path) {
  try {
    const response = await githubClient.get(
      `/repos/${owner}/${repo}/contents/${path}`
    );
    
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    console.warn(`Could not fetch ${path}: ${error.message}`);
    return null;
  }
}

/**
 * Fetch contents of multiple files with a concurrency limit.
 */
async function getMultipleFileContents(owner, repo, filePaths) {
  const results = [];
  const BATCH_SIZE = 5; // Fetch 5 files at a time
  
  for (let i = 0; i < filePaths.length; i += BATCH_SIZE) {
    const batch = filePaths.slice(i, i + BATCH_SIZE);
    
    // Promise.all = "wait for ALL of these to finish"
    const batchResults = await Promise.all(
      batch.map(async (path) => {
        const content = await getFileContent(owner, repo, path);
        return { path, content };
      })
    );
    
    results.push(...batchResults.filter(r => r.content !== null));
    console.log(`Fetched files: ${Math.min(i + BATCH_SIZE, filePaths.length)}/${filePaths.length}`);
  }
  return results;
}

/**
 * Fetch recent commits (last 90 days) to analyze which files change most.
 */
async function getCommits(owner, repo, daysBack = 90) {
  const since = new Date();
  since.setDate(since.getDate() - daysBack);
  
  const commits = [];
  let page = 1;
  const MAX_COMMITS = 200; // Cap to avoid too many API calls
  
  while (commits.length < MAX_COMMITS) {
    const response = await githubClient.get(
      `/repos/${owner}/${repo}/commits`, {
        params: {
          since: since.toISOString(),
          per_page: 100,
          page: page,
        }
      }
    );
    
    if (response.data.length === 0) break; // No more commits
    commits.push(...response.data);
    page++;
  }
  
  return commits.slice(0, MAX_COMMITS);
}

/**
 * For a given commit, get the list of files that were changed.
 */
async function getCommitFiles(owner, repo, commitSha) {
  try {
    const response = await githubClient.get(
      `/repos/${owner}/${repo}/commits/${commitSha}`
    );
    return response.data.files || []; // Array of { filename, status, changes }
  } catch (error) {
    console.warn(`Could not fetch commit ${commitSha}: ${error.message}`);
    return [];
  }
}

/**
 * Fetch all open issues from the repository.
 */
async function getIssues(owner, repo) {
  const issues = [];
  let page = 1;
  
  while (true) {
    const response = await githubClient.get(
      `/repos/${owner}/${repo}/issues`, {
        params: {
          state: 'open',
          per_page: 100,
          page: page,
        }
      }
    );
    
    if (response.data.length === 0) break;
    
    // Filter out pull requests (GitHub returns PRs in the issues endpoint too)
    const onlyIssues = response.data.filter(issue => !issue.pull_request);
    issues.push(...onlyIssues);
    page++;
    
    if (response.data.length < 100) break; // Last page
  }
  
  return issues;
}

/**
 * Fetch the README file of a repository.
 * Returns the content and word count, or null if no README exists.
 */
async function getReadme(owner, repo) {
  try {
    const response = await githubClient.get(`/repos/${owner}/${repo}/readme`);
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const wordCount = content.split(/\s+/).length;
    return { content, wordCount, exists: true };
  } catch (error) {
    // 404 = no README file
    return { content: null, wordCount: 0, exists: false };
  }
}

// Export all functions so other files can use them
// In Node.js, module.exports is how you "share" code between files
module.exports = {
  parseGitHubUrl,
  getRepoTree,
  getFileContent,
  getMultipleFileContents,
  getCommits,
  getCommitFiles,
  getIssues,
  getReadme,
};

