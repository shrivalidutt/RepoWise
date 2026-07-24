/**
 * Extracts import statements from Go files.
 */
function parseGoImports(fileContent) {
  const imports = [];
  // Single import
  const singleImportRegex = /^import\s+"([^"]+)"/gm;
  let match;
  while ((match = singleImportRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  // Grouped import
  const groupImportRegex = /import\s+\(\s*([^)]+)\s*\)/g;
  while ((match = groupImportRegex.exec(fileContent)) !== null) {
    const groupContent = match[1];
    const stringRegex = /"([^"]+)"/g;
    let strMatch;
    while ((strMatch = stringRegex.exec(groupContent)) !== null) {
      imports.push(strMatch[1]);
    }
  }
  return imports;
}

module.exports = { parseGoImports };
