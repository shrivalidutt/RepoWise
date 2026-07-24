/**
 * Extracts import statements from Python files.
 */

function parsePyImports(fileContent) {
  const imports = [];

  
  const fromImportRegex = /from\s+(\S+)\s+import/g;
  let match;
  while ((match = fromImportRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  const importRegex = /^import\s+(\S+)/gm;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

module.exports = { parsePyImports };
