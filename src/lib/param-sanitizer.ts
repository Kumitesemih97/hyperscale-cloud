export interface CalculatorPreset {
  sku: string;
  vcpu: number;
  gpuCount: number;
  storageTb: number;
  egressTb: number;
}

const VALID_SKUS = new Set([
  "b200-supercluster",
  "h100-octa",
  "baremetal-epyc",
  "highmem-db",
]);

function parseNumberWithFallback(raw: string | null, min: number, max: number, fallback: number): number {
  if (raw === null || raw.trim() === "") return fallback;
  const num = Number(raw);
  if (Number.isNaN(num) || !Number.isFinite(num)) return fallback;
  return Math.min(Math.max(Math.floor(num), min), max);
}

export function parseAndClampParams(searchParams: URLSearchParams): CalculatorPreset {
  const rawSku = searchParams.get("sku") || "b200-supercluster";
  const sku = VALID_SKUS.has(rawSku) ? rawSku : "b200-supercluster";

  const vcpu = parseNumberWithFallback(searchParams.get("vcpu"), 4, 1024, 128);
  const gpuCount = parseNumberWithFallback(searchParams.get("gpuCount"), 0, 512, 8);
  const storageTb = parseNumberWithFallback(searchParams.get("storageTb"), 1, 1000, 50);
  const egressTb = parseNumberWithFallback(searchParams.get("egressTb"), 0, 5000, 20);

  return { sku, vcpu, gpuCount, storageTb, egressTb };
}
