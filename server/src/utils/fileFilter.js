
// File extensions we can analyze (add more as needed)
const ANALYZABLE_EXTENSIONS = new Set([
  '.js', '.jsx', '.ts', '.tsx',     // JavaScript / TypeScript
  '.py',                             // Python
  '.java',                           // Java
  '.go',                             // Go
  '.rb',                             // Ruby
  '.rs',                             // Rust
  '.cpp', '.c', '.h', '.hpp',       // C / C++
  '.cs',                             // C#
  '.php',                            // PHP
  '.swift',                          // Swift
  '.kt',                             // Kotlin
  '.vue', '.svelte',                 // Frontend frameworks
  '.css', '.scss', '.less',          // Stylesheets
  '.html',                           // HTML
  '.json',                           // JSON configs
  '.yaml', '.yml',                   // YAML configs
  '.md',                             // Markdown docs
]);

// Directories and patterns to always exclude
const EXCLUDED_PATTERNS = [
  'node_modules/',
  'vendor/',
  'dist/',
  'build/',
  '.git/',
  '__pycache__/',
  '.next/',
  'coverage/',
  '.nyc_output/',
  '.min.',           // Minified files
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
];

/**
 * Filter a file tree to only include analyzable source files.
 * 
 * @param {Array} tree - Array of { path, type } from GitHub API
 * @param {number} maxFiles - Maximum files to return (prevents huge repos from overwhelming us)
 * @returns {Array} Filtered array of file paths
 */
function filterAnalyzableFiles(tree, maxFiles = 300) {
  return tree
    .filter(item => item.type === 'blob')
    .filter(item => {
      const ext = '.' + item.path.split('.').pop().toLowerCase();
      return ANALYZABLE_EXTENSIONS.has(ext);
    })
    .filter(item => {
      return !EXCLUDED_PATTERNS.some(pattern => item.path.includes(pattern));
    })
    // Sort to prefer src/ files 
    .sort((a, b) => {
      const aInSrc = a.path.startsWith('src/') ? 0 : 1;
      const bInSrc = b.path.startsWith('src/') ? 0 : 1;
      return aInSrc - bInSrc;
    })
    .slice(0, maxFiles)
    .map(item => item.path);
}

module.exports = { filterAnalyzableFiles };
