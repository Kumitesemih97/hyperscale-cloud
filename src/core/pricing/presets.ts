import { clampSpecs, type Specs } from "./tco";

export interface SkuPreset extends Specs {
  name: string;
  sku: string;
  category: "compute" | "storage" | "aiml" | "networking";
}

export const SKU_PRESETS: Record<string, SkuPreset> = {
  "b200-cluster": {
    sku: "b200-cluster",
    name: "NVIDIA B200 SXM6 AI Supernodes",
    category: "compute",
    vcpu: 128,
    gpuCount: 8,
    storageTb: 30,
    egressTb: 60,
  },
  "bare-metal-epyc": {
    sku: "bare-metal-epyc",
    name: "Dual AMD EPYC 9654 Bare Metal",
    category: "compute",
    vcpu: 192,
    gpuCount: 0,
    storageTb: 60,
    egressTb: 40,
  },
  "serverless-microvm": {
    sku: "serverless-microvm",
    name: "Autonomous MicroVM Serverless",
    category: "compute",
    vcpu: 32,
    gpuCount: 0,
    storageTb: 5,
    egressTb: 20,
  },
  "h100-cluster": {
    sku: "h100-cluster",
    name: "NVIDIA H100 SXM5 Superclusters",
    category: "aiml",
    vcpu: 96,
    gpuCount: 8,
    storageTb: 25,
    egressTb: 50,
  },
  "nvme-block": {
    sku: "nvme-block",
    name: "Distributed NVMe-oF Ultra Block",
    category: "storage",
    vcpu: 64,
    gpuCount: 0,
    storageTb: 100,
    egressTb: 50,
  },
};

/**
 * Parses URL query params or hash fragment (e.g. #calculator?sku=b200-cluster&vcpu=256)
 * into safe, clamped Specs for the CostEstimator.
 */
export function parseSpecsFromUrl(hashOrQuery: string, fallback: Specs): Specs {
  if (!hashOrQuery || typeof hashOrQuery !== "string") {
    return clampSpecs(fallback);
  }

  const questionMarkIndex = hashOrQuery.indexOf("?");
  const queryString = questionMarkIndex !== -1 ? hashOrQuery.slice(questionMarkIndex + 1) : hashOrQuery;

  if (!queryString) {
    return clampSpecs(fallback);
  }

  const params = new URLSearchParams(queryString);
  let baseSpecs: Specs = { ...fallback };

  const sku = params.get("sku")?.toLowerCase();
  if (sku && SKU_PRESETS[sku]) {
    baseSpecs = {
      vcpu: SKU_PRESETS[sku].vcpu,
      gpuCount: SKU_PRESETS[sku].gpuCount,
      storageTb: SKU_PRESETS[sku].storageTb,
      egressTb: SKU_PRESETS[sku].egressTb,
    };
  }

  const vcpuParam = params.get("vcpu");
  if (vcpuParam !== null && !isNaN(Number(vcpuParam))) {
    baseSpecs.vcpu = Number(vcpuParam);
  }

  const gpuParam = params.get("gpu") ?? params.get("gpuCount");
  if (gpuParam !== null && !isNaN(Number(gpuParam))) {
    baseSpecs.gpuCount = Number(gpuParam);
  }

  const storageParam = params.get("storage") ?? params.get("storageTb");
  if (storageParam !== null && !isNaN(Number(storageParam))) {
    baseSpecs.storageTb = Number(storageParam);
  }

  const egressParam = params.get("egress") ?? params.get("egressTb");
  if (egressParam !== null && !isNaN(Number(egressParam))) {
    baseSpecs.egressTb = Number(egressParam);
  }

  return clampSpecs(baseSpecs);
}

