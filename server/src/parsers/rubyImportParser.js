/**
 * Extracts require/load statements from Ruby files.
 */
function parseRubyImports(fileContent) {
  const imports = [];
  const requireRegex = /^\s*(?:require|require_relative|load)\s+['"]([^'"]+)['"]/gm;
  let match;
  while ((match = requireRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

module.exports = { parseRubyImports };
