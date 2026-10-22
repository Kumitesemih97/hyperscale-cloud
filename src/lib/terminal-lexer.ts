export type TokenType = "KEYWORD" | "SUBCOMMAND" | "FLAG" | "PUNCTUATION" | "VALUE";

export interface Token {
  type: TokenType;
  value: string;
}

const ALLOWED_COMMANDS = new Set([
  "aether",
  "terraform",
  "pulumi",
  "cat",
  "help",
  "clear",
  "ping",
  "kubectl",
  "curl",
]);

const ALLOWED_SUBCOMMANDS = new Set([
  "deploy",
  "plan",
  "apply",
  "init",
  "destroy",
  "status",
  "diff",
  "validate",
]);

export function sanitizeTerminalInput(raw: string): string {
  if (!raw) return "";
  return raw
    .slice(0, 512) // Enforce hard buffer limit to prevent ReDoS / memory exhaustion
    .replace(/\x1b\[[0-9;]*[a-zA-Z]/g, "") // Strip ANSI escape sequences
    .replace(/[\x00-\x1F\x7F-\x9F]/g, "") // Strip residual control codes
    .trim();
}

export function tokenizeCommandLine(input: string): Token[] {
  const clean = sanitizeTerminalInput(input);
  if (!clean) return [];

  // Match words, quoted strings, or operators
  const parts = clean.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || [];
  return parts.map((part, index) => {
    const unquoted = part.replace(/^['"]|['"]$/g, "");

    if (index === 0 && ALLOWED_COMMANDS.has(unquoted.toLowerCase())) {
      return { type: "KEYWORD", value: part };
    }
    if (index === 1 && ALLOWED_SUBCOMMANDS.has(unquoted.toLowerCase())) {
      return { type: "SUBCOMMAND", value: part };
    }
    if (part.startsWith("-")) {
      return { type: "FLAG", value: part };
    }
    if (part === "|" || part === "&&" || part === ">" || part === ";") {
      return { type: "PUNCTUATION", value: part };
    }
    return { type: "VALUE", value: part };
  });
}
