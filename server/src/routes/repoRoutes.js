
const express = require('express');
const router = express.Router();
const githubService = require('../services/githubService');
const { filterAnalyzableFiles } = require('../utils/fileFilter');

router.post('/analyze', async (req, res) => {
  try {
    //Parse the URL
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'GitHub URL is required' });
    }
    const { owner, repo } = githubService.parseGitHubUrl(url);
    console.log(`\n Analyzing: ${owner}/${repo}`);
    
    //Fetch the file tree
    console.log(' Fetching file tree...');
    const tree = await githubService.getRepoTree(owner, repo);
    console.log(`   Found ${tree.length} items in tree`);
    
    //Filter to analyzable files
    const analyzableFiles = filterAnalyzableFiles(tree);
    console.log(`   Filtered to ${analyzableFiles.length} analyzable files`);
    
    //Fetch open issues
    console.log(' Fetching issues...');
    const issues = await githubService.getIssues(owner, repo);
    console.log(`   Found ${issues.length} open issues`);
    
    //Check README
    console.log(' Checking README...');
    const readme = await githubService.getReadme(owner, repo);
    console.log(`   README exists: ${readme.exists}, words: ${readme.wordCount}`);
    
    // Return a summary (we'll expand this as we build features)
    res.json({
      repoId: `${owner}__${repo}`,
      owner,
      repo,
      stats: {
        totalItems: tree.length,
        analyzableFiles: analyzableFiles.length,
        openIssues: issues.length,
        readmeExists: readme.exists,
        readmeWords: readme.wordCount,
      },
      sampleFiles: analyzableFiles.slice(0, 20),
      sampleIssues: issues.slice(0, 5).map(i => ({
        number: i.number,
        title: i.title,
        labels: i.labels.map(l => l.name),
      })),
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
