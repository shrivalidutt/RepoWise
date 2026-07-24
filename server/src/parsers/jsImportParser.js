/**
 * Extracts import/require statements from JavaScript/TypeScript files.
 */

function parseJSImports(fileContent) {
  const imports = [];

  const esImportRegex = /import\s+.*?from\s+['"](.+?)['"]/g;
  let match;
  while ((match = esImportRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  const requireRegex = /require\s*\(\s*['"](.+?)['"]\s*\)/g;
  while ((match = requireRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  const dynamicImportRegex = /import\s*\(\s*['"](.+?)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

module.exports = { parseJSImports };
