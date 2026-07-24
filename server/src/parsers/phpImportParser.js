/**
 * Extracts use/require/include statements from PHP files.
 */
function parsePhpImports(fileContent) {
  const imports = [];
  // use Statement
  const useRegex = /^\s*use\s+([\w\\]+)(?:\s+as\s+\w+)?;$/gm;
  let match;
  while ((match = useRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  // require/include
  const reqRegex = /^\s*(?:require|require_once|include|include_once)\s*\(?['"]([^'"]+)['"]\)?;/gm;
  while ((match = reqRegex.exec(fileContent)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

module.exports = { parsePhpImports };
