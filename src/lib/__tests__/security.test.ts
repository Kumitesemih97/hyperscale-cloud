import test from "node:test";
import assert from "node:assert/strict";

import { sanitizeTerminalInput, tokenizeCommandLine } from "../terminal-lexer.js";
import { parseAndClampParams } from "../param-sanitizer.js";

test("Terminal Lexer: sanitization, length boundaries, and control byte stripping", () => {
  // Test control byte stripping (ANSI escapes, null bytes, bell)
  const dirty = "\x1b[31mterraform\x1b[0m \x00deploy --target=cluster\x07";
  const cleaned = sanitizeTerminalInput(dirty);
  assert.equal(cleaned, "terraform deploy --target=cluster");

  // Test buffer length clamp (512 max chars)
  const hugeInput = "a".repeat(1000);
  const clamped = sanitizeTerminalInput(hugeInput);
  assert.equal(clamped.length, 512);

  // Empty string handling
  assert.equal(sanitizeTerminalInput(""), "");
});

test("Terminal Lexer: deterministic AST tokenization without dynamic evaluation", () => {
  const line = 'aether deploy -var="region=eu-central-1" --auto-approve';
  const tokens = tokenizeCommandLine(line);

  assert.equal(tokens[0].type, "KEYWORD");
  assert.equal(tokens[0].value, "aether");

  assert.equal(tokens[1].type, "SUBCOMMAND");
  assert.equal(tokens[1].value, "deploy");

  assert.equal(tokens[2].type, "FLAG");
  assert.equal(tokens[2].value, '-var="region=eu-central-1"');

  assert.equal(tokens[3].type, "FLAG");
  assert.equal(tokens[3].value, "--auto-approve");

  // Adversarial XSS payload attempt: must be tokenized as harmless text/value
  const xssAttempt = '<script>alert("pwned")</script>';
  const xssTokens = tokenizeCommandLine(xssAttempt);
  assert.equal(xssTokens[0].type, "VALUE");
  assert.equal(xssTokens[0].value, '<script>alert("pwned")</script>');
});

test("Param Sanitizer: parameter clamping and prototype pollution immunity", () => {
  // Safe defaults on empty params
  const empty = new URLSearchParams("");
  const defaultRes = parseAndClampParams(empty);
  assert.equal(defaultRes.sku, "b200-supercluster");
  assert.equal(defaultRes.vcpu, 128);
  assert.equal(defaultRes.gpuCount, 8);
  assert.equal(defaultRes.storageTb, 50);
  assert.equal(defaultRes.egressTb, 20);

  // Boundary clamp on absurd/negative inputs
  const crazy = new URLSearchParams("vcpu=-999&gpuCount=999999&storageTb=NaN&egressTb=Infinity");
  const clampedRes = parseAndClampParams(crazy);
  assert.equal(clampedRes.vcpu, 4); // Min vcpu clamp
  assert.equal(clampedRes.gpuCount, 512); // Max gpu clamp
  assert.equal(clampedRes.storageTb, 50); // Fallback on NaN
  assert.equal(clampedRes.egressTb, 20); // Fallback on Infinity

  // Prototype pollution attempt
  const attack = new URLSearchParams("__proto__=poisoned&constructor=evil&sku=unknown-hack");
  const attackRes = parseAndClampParams(attack);
  assert.equal(attackRes.sku, "b200-supercluster");
  assert.equal((attackRes as any).__proto__.poisoned, undefined);
});

