/**
 * Builds the architecture graph data from file tree + import analysis.
 * 
 * The output is a JSON object that React Flow can render:
 * {
 *   nodes: [{ id, label, layer, ... }],
 *   edges: [{ source, target }]
 * }
 */

const { parseJSImports } = require('../parsers/jsImportParser');
const { parsePyImports } = require('../parsers/pyImportParser');
const { parseJavaImports } = require('../parsers/javaImportParser');
const { parseGoImports } = require('../parsers/goImportParser');
const { parseRubyImports } = require('../parsers/rubyImportParser');
const { parseCppImports } = require('../parsers/cppImportParser');
const { parseCsImports } = require('../parsers/csImportParser');
const { parsePhpImports } = require('../parsers/phpImportParser');
const path = require('path');

/**
 * Detect what "layer" a file belongs to based on its path.
 */
function detectLayer(filePath) {
  const p = filePath.toLowerCase();
  
  // Frontend indicators
  if (p.includes('component') || p.includes('page') || p.includes('view') ||
      p.includes('hook') || p.includes('.jsx') || p.includes('.tsx') ||
      p.includes('.vue') || p.includes('.svelte') || p.includes('src/app')) {
    return 'frontend';
  }
  
  // Backend indicators
  if (p.includes('route') || p.includes('controller') || p.includes('middleware') ||
      p.includes('service') || p.includes('api/') || p.includes('server')) {
    return 'backend';
  }
  
  // Database indicators
  if (p.includes('model') || p.includes('schema') || p.includes('migration') ||
      p.includes('seed') || p.includes('database') || p.includes('db')) {
    return 'database';
  }
  
  // Config/utility
  return 'config';
}

const LAYER_COLORS = {
  frontend: '#3B82F6',   // Blue
  backend: '#10B981',    // Green
  database: '#F59E0B',   // Amber
  config: '#6B7280',     // Grey
};

/**
 * Resolve a relative import path to an actual file path in the repo.
 * 
 * Example:
 *   Current file: "src/components/Auth.jsx"
 *   Import: "../api/authService"
 *   Resolved: "src/api/authService"
 */
function resolveImportPath(currentFilePath, importPath, allFilePaths) {
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    return null; // External package, not a file in our repo
  }

  // Get the directory of the current file
  const currentDir = path.dirname(currentFilePath);
  
  // Resolve the relative path
  let resolved = path.posix.join(currentDir, importPath);
  
  const possibleExtensions = ['', '.js', '.jsx', '.ts', '.tsx', '.py', '/index.js', '/index.tsx'];
  
  for (const ext of possibleExtensions) {
    const candidate = resolved + ext;
    if (allFilePaths.includes(candidate)) {
      return candidate;
    }
  }
  
  return null; // Could not resolve — might be a typo or complex alias
}

/**
 * Build the complete architecture graph.
 */
function buildArchitectureGraph(filePaths, fileContents) {
  // ---- BUILD NODES ----
  const nodes = filePaths.map((filePath, index) => {
    const layer = detectLayer(filePath);
    return {
      id: filePath,
      label: path.basename(filePath),
      fullPath: filePath,
      layer: layer,
      color: LAYER_COLORS[layer],
      // Extract folder for grouping
      directory: path.dirname(filePath),
    };
  });

  // ---- BUILD EDGES (connections between files) ----
  const edges = [];
  const edgeSet = new Set(); // Prevent duplicate edges

  for (const file of fileContents) {
    // Choose parser based on file extension
    const ext = path.extname(file.path).toLowerCase();
    let imports = [];
    
    if (['.js', '.jsx', '.ts', '.tsx'].includes(ext)) {
      imports = parseJSImports(file.content);
    } else if (ext === '.py') {
      imports = parsePyImports(file.content);
    } else if (ext === '.java') {
      imports = parseJavaImports(file.content);
    } else if (ext === '.go') {
      imports = parseGoImports(file.content);
    } else if (['.rb'].includes(ext)) {
      imports = parseRubyImports(file.content);
    } else if (['.cpp', '.c', '.h', '.hpp'].includes(ext)) {
      imports = parseCppImports(file.content);
    } else if (ext === '.cs') {
      imports = parseCsImports(file.content);
    } else if (ext === '.php') {
      imports = parsePhpImports(file.content);
    }
    // Add more parsers here as needed (Swift, Kotlin, etc.)

    // Resolve each import to an actual file in the repo
    for (const importPath of imports) {
      const resolvedPath = resolveImportPath(file.path, importPath, filePaths);
      
      if (resolvedPath) {
        const edgeKey = `${file.path}→${resolvedPath}`;
        if (!edgeSet.has(edgeKey)) {
          edgeSet.add(edgeKey);
          edges.push({
            id: edgeKey,
            source: file.path,
            target: resolvedPath,
          });
        }
      }
    }
  }

  return { nodes, edges };
}

module.exports = { buildArchitectureGraph, detectLayer, LAYER_COLORS };
