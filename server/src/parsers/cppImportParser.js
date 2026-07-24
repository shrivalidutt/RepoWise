/**
 * Extracts include statements from C/C++ files.
 */
function parseCppImports(fileContent) {
  const imports = [];
  const includeRegex = /^\s*#include\s*[<"]([^>"]+)[>"]/gm;
  let match;
  while ((match = includeRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

module.exports = { parseCppImports };
