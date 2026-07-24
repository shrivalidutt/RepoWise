/**
 * Extracts using statements from C# files.
 */
function parseCsImports(fileContent) {
  const imports = [];
  const usingRegex = /^\s*using\s+([\w.]+);/gm;
  let match;
  while ((match = usingRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

module.exports = { parseCsImports };
