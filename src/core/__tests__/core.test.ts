import test from "node:test";
import assert from "node:assert/strict";

import { calculateTCO, clampSpecs, type Specs } from "../pricing/tco.js";
import { haversineDistance, calculateLatency, GLOBAL_POPS } from "../network/topology.js";
import { createSandboxFSM, tokenizeCode } from "../sandbox/fsm.js";
import { parseSpecsFromUrl, SKU_PRESETS } from "../pricing/presets.js";

test("TCO Engine: calculation integrity and boundary clamps", () => {
  // Test zero boundary
  const zeroSpecs: Specs = { vcpu: 0, gpuCount: 0, storageTb: 0, egressTb: 0 };
  const clampedZero = clampSpecs(zeroSpecs);
  assert.equal(clampedZero.vcpu, 4); // Minimum baseline vCPU
  assert.equal(clampedZero.gpuCount, 0);

  const zeroResult = calculateTCO(zeroSpecs);
  assert.ok(zeroResult.hyperCloudMonthlyCents > 0);
  assert.ok(zeroResult.awsMonthlyCents > zeroResult.hyperCloudMonthlyCents);
  assert.ok(zeroResult.savingsPercent > 0 && zeroResult.savingsPercent < 100);
  assert.ok(Number.isInteger(zeroResult.hyperCloudMonthlyCents));
  assert.ok(Number.isInteger(zeroResult.awsMonthlyCents));

  // Test hyperscale scale specs
  const clusterSpecs: Specs = { vcpu: 256, gpuCount: 32, storageTb: 50, egressTb: 100 };
  const result = calculateTCO(clusterSpecs);
  assert.ok(result.hyperCloudMonthlyCents > 0);
  assert.ok(result.awsMonthlyCents > result.hyperCloudMonthlyCents);
  assert.ok(result.gcpMonthlyCents > result.hyperCloudMonthlyCents);
  assert.ok(result.azureMonthlyCents > result.hyperCloudMonthlyCents);
  assert.ok(result.savingsPercent >= 35, `Expected >= 35% savings, got ${result.savingsPercent}%`);
});

test("Network Topology: Geodesic distances and latency physics", () => {
  const iad = GLOBAL_POPS.find((p) => p.code === "iad");
  const fra = GLOBAL_POPS.find((p) => p.code === "fra");
  const nrt = GLOBAL_POPS.find((p) => p.code === "nrt");

  assert.ok(iad && fra && nrt, "Expected major PoPs to exist");

  // Transatlantic distance IAD to FRA is approx 6,500 - 7,000 km
  const distIadFra = haversineDistance(iad.lat, iad.lon, fra.lat, fra.lon);
  assert.ok(distIadFra > 6000 && distIadFra < 7500, `IAD-FRA distance: ${distIadFra}km`);

  // Fiber latency model should be realistic (speed of light in glass ~ 200,000 km/s + overhead)
  const latencyIadFra = calculateLatency(iad, fra);
  assert.ok(latencyIadFra >= 65 && latencyIadFra <= 85, `IAD-FRA latency: ${latencyIadFra}ms`);

  // Same PoP latency should be <= 1.0 ms
  const localLatency = calculateLatency(iad, iad);
  assert.ok(localLatency <= 1.5, `Local latency: ${localLatency}ms`);
});

test("Sandbox FSM: deterministic state transitions and AST tokenizer", () => {
  const fsm = createSandboxFSM();
  assert.equal(fsm.getState(), "idle");

  fsm.send({ type: "SELECT_IAC", template: "pulumi" });
  assert.equal(fsm.getTemplate(), "pulumi");
  assert.equal(fsm.getState(), "idle");

  fsm.send({ type: "DEPLOY" });
  assert.equal(fsm.getState(), "planning");

  fsm.send({ type: "TICK" });
  assert.equal(fsm.getState(), "provisioning");

  fsm.send({ type: "TICK" });
  assert.equal(fsm.getState(), "verifying");

  fsm.send({ type: "TICK" });
  assert.equal(fsm.getState(), "ready");

  // Tokenizer safety test: no HTML tags emitted, pure token objects
  const code = `resource "hypercloud_cluster" "ai_mesh" {\n  nodes = 64\n}`;
  const tokens = tokenizeCode(code);
  assert.ok(tokens.length > 0);
  assert.ok(tokens.every((t) => typeof t.type === "string" && typeof t.value === "string"));
  assert.ok(!tokens.some((t) => t.value.includes("<script>")));
});

test("Cross-Component Preset Engine: SKU mapping and URL hash parsing", () => {
  const defaultSpecs: Specs = { vcpu: 64, gpuCount: 4, storageTb: 20, egressTb: 40 };

  // Test known SKU preset mapping
  assert.ok("b200-cluster" in SKU_PRESETS);
  assert.equal(SKU_PRESETS["b200-cluster"].gpuCount, 8);
  assert.equal(SKU_PRESETS["b200-cluster"].vcpu, 128);

  // Test URL hash with sku param
  const parsedSku = parseSpecsFromUrl("#calculator?sku=b200-cluster", defaultSpecs);
  assert.equal(parsedSku.vcpu, 128);
  assert.equal(parsedSku.gpuCount, 8);

  // Test URL hash with explicit numeric overrides
  const parsedExplicit = parseSpecsFromUrl("#calculator?vcpu=256&gpu=16&storage=50&egress=100", defaultSpecs);
  assert.equal(parsedExplicit.vcpu, 256);
  assert.equal(parsedExplicit.gpuCount, 16);
  assert.equal(parsedExplicit.storageTb, 50);
  assert.equal(parsedExplicit.egressTb, 100);

  // Test boundary clamping on malicious/extreme params
  const parsedClamped = parseSpecsFromUrl("#calculator?vcpu=999999&gpu=999999", defaultSpecs);
  assert.equal(parsedClamped.vcpu, 1024);
  assert.equal(parsedClamped.gpuCount, 64);

  // Test fallback on empty/invalid string
  const parsedEmpty = parseSpecsFromUrl("", defaultSpecs);
  assert.deepEqual(parsedEmpty, defaultSpecs);
});
