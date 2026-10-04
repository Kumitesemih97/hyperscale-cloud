export interface Token {
  type: "keyword" | "string" | "property" | "comment" | "punctuation" | "number" | "text";
  value: string;
}

const KEYWORDS = new Set([
  "terraform",
  "required_providers",
  "source",
  "version",
  "resource",
  "import",
  "export",
  "from",
  "as",
  "const",
  "let",
  "var",
  "new",
  "true",
  "false",
  "hypercloud",
  "auth",
  "cluster",
  "deploy",
]);

export function tokenizeCode(code: string): Token[] {
  const lines = code.split("\n");
  const tokens: Token[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0) {
      tokens.push({ type: "punctuation", value: "\n" });
    }

    // Full line comment
    if (line.trim().startsWith("#") || line.trim().startsWith("//")) {
      tokens.push({ type: "comment", value: line });
      continue;
    }

    // Token regex preserving strings with escapes, CLI flags, keywords/identifiers, operators/symbols, whitespace, and any single character
    const regex = /(?:"(?:[^"\\]|\\.)*"|\/\/[^\n]*|#[^\n]*|--[a-zA-Z0-9_-]+|[a-zA-Z_][a-zA-Z0-9_-]*|\b\d+(?:\.\d+)?\b|&&|\|\||==|!=|<=|>=|=>|\s+|[^\s\w])/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      const val = match[0];
      if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
        tokens.push({ type: "string", value: val });
      } else if (val.startsWith("//") || val.startsWith("#")) {
        tokens.push({ type: "comment", value: val });
      } else if (val.startsWith("--")) {
        tokens.push({ type: "property", value: val });
      } else if (KEYWORDS.has(val)) {
        tokens.push({ type: "keyword", value: val });
      } else if (/^\d+(\.\d+)?$/.test(val)) {
        tokens.push({ type: "number", value: val });
      } else if (/^[{}[\],.:=()\\|;*@<>!&?+\-%^~/`$]$/.test(val) || val === "&&" || val === "||" || val === "==" || val === "!=") {
        tokens.push({ type: "punctuation", value: val });
      } else {
        tokens.push({ type: "text", value: val });
      }
    }
  }

  return tokens;
}
