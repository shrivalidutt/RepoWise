/**
 * Extracts import statements from Java files.
 */
function parseJavaImports(fileContent) {
  const imports = [];
  const importRegex = /^import\s+(?:static\s+)?([\w.]+);?/gm;
  let match;
  while ((match = importRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

module.exports = { parseJavaImports };
