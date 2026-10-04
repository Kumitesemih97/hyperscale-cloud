export interface Specs {
  vcpu: number;
  gpuCount: number;
  storageTb: number;
  egressTb: number;
}

export interface TCOBreakdown {
  hyperCloudMonthlyCents: number;
  awsMonthlyCents: number;
  gcpMonthlyCents: number;
  azureMonthlyCents: number;
  savingsCents: number;
  savingsPercent: number;
  specs: Specs;
}

export const MIN_SPECS: Specs = {
  vcpu: 4,
  gpuCount: 0,
  storageTb: 1,
  egressTb: 5,
};

export const MAX_SPECS: Specs = {
  vcpu: 1024,
  gpuCount: 64,
  storageTb: 500,
  egressTb: 1000,
};

export function clampSpecs(specs: Partial<Specs>): Specs {
  return {
    vcpu: Math.max(MIN_SPECS.vcpu, Math.min(MAX_SPECS.vcpu, Math.round(specs.vcpu ?? MIN_SPECS.vcpu))),
    gpuCount: Math.max(MIN_SPECS.gpuCount, Math.min(MAX_SPECS.gpuCount, Math.round(specs.gpuCount ?? MIN_SPECS.gpuCount))),
    storageTb: Math.max(MIN_SPECS.storageTb, Math.min(MAX_SPECS.storageTb, Math.round(specs.storageTb ?? MIN_SPECS.storageTb))),
    egressTb: Math.max(MIN_SPECS.egressTb, Math.min(MAX_SPECS.egressTb, Math.round(specs.egressTb ?? MIN_SPECS.egressTb))),
  };
}

const HOURS_PER_MONTH = 730;

// All values in CENTS ($1.00 = 100 cents)
export const PRICING_RATES = {
  hyperCloud: {
    vcpuPerHourCents: 2.2, // $0.022 / hr
    gpuPerHourCents: 215, // $2.15 / hr (H100 SXM5 / B200 class)
    storagePerTbMonthCents: 4500, // $45.00 / TB-month NVMe
    egressPerTbCents: 1500, // $15.00 / TB (First 20TB free)
    freeEgressTb: 20,
  },
  aws: {
    vcpuPerHourCents: 4.16, // $0.0416 / hr (c7i.large equiv)
    gpuPerHourCents: 398, // $3.98 / hr (p5.48xlarge equiv per GPU)
    storagePerTbMonthCents: 8000, // $80.00 / TB-month (gp3)
    egressPerTbCents: 9000, // $90.00 / TB ($0.09/GB)
    freeEgressTb: 0.1,
  },
  gcp: {
    vcpuPerHourCents: 3.85, // $0.0385 / hr (c3-standard)
    gpuPerHourCents: 385, // $3.85 / hr (a3-highgpu)
    storagePerTbMonthCents: 8500, // $85.00 / TB-month (Hyperdisk)
    egressPerTbCents: 8500, // $85.00 / TB ($0.085/GB)
    freeEgressTb: 0.2,
  },
  azure: {
    vcpuPerHourCents: 4.02, // $0.0402 / hr (D-series v5)
    gpuPerHourCents: 395, // $3.95 / hr (ND H100 v5)
    storagePerTbMonthCents: 8200, // $82.00 / TB-month (Premium SSD v2)
    egressPerTbCents: 8700, // $87.00 / TB ($0.087/GB)
    freeEgressTb: 0.1,
  },
} as const;

export function calculateTCO(rawSpecs: Partial<Specs>): TCOBreakdown {
  const specs = clampSpecs(rawSpecs);

  // HyperCloud calculation
  const hcComputeCents = Math.round(specs.vcpu * PRICING_RATES.hyperCloud.vcpuPerHourCents * HOURS_PER_MONTH);
  const hcGpuCents = Math.round(specs.gpuCount * PRICING_RATES.hyperCloud.gpuPerHourCents * HOURS_PER_MONTH);
  const hcStorageCents = Math.round(specs.storageTb * PRICING_RATES.hyperCloud.storagePerTbMonthCents);
  const hcBillableEgress = Math.max(0, specs.egressTb - PRICING_RATES.hyperCloud.freeEgressTb);
  const hcEgressCents = Math.round(hcBillableEgress * PRICING_RATES.hyperCloud.egressPerTbCents);
  const hyperCloudMonthlyCents = hcComputeCents + hcGpuCents + hcStorageCents + hcEgressCents;

  // AWS calculation
  const awsCompute = Math.round(specs.vcpu * PRICING_RATES.aws.vcpuPerHourCents * HOURS_PER_MONTH);
  const awsGpu = Math.round(specs.gpuCount * PRICING_RATES.aws.gpuPerHourCents * HOURS_PER_MONTH);
  const awsStorage = Math.round(specs.storageTb * PRICING_RATES.aws.storagePerTbMonthCents);
  const awsEgress = Math.round(Math.max(0, specs.egressTb - PRICING_RATES.aws.freeEgressTb) * PRICING_RATES.aws.egressPerTbCents);
  const awsMonthlyCents = awsCompute + awsGpu + awsStorage + awsEgress;

  // GCP calculation
  const gcpCompute = Math.round(specs.vcpu * PRICING_RATES.gcp.vcpuPerHourCents * HOURS_PER_MONTH);
  const gcpGpu = Math.round(specs.gpuCount * PRICING_RATES.gcp.gpuPerHourCents * HOURS_PER_MONTH);
  const gcpStorage = Math.round(specs.storageTb * PRICING_RATES.gcp.storagePerTbMonthCents);
  const gcpEgress = Math.round(Math.max(0, specs.egressTb - PRICING_RATES.gcp.freeEgressTb) * PRICING_RATES.gcp.egressPerTbCents);
  const gcpMonthlyCents = gcpCompute + gcpGpu + gcpStorage + gcpEgress;

  // Azure calculation
  const azCompute = Math.round(specs.vcpu * PRICING_RATES.azure.vcpuPerHourCents * HOURS_PER_MONTH);
  const azGpu = Math.round(specs.gpuCount * PRICING_RATES.azure.gpuPerHourCents * HOURS_PER_MONTH);
  const azStorage = Math.round(specs.storageTb * PRICING_RATES.azure.storagePerTbMonthCents);
  const azEgress = Math.round(Math.max(0, specs.egressTb - PRICING_RATES.azure.freeEgressTb) * PRICING_RATES.azure.egressPerTbCents);
  const azureMonthlyCents = azCompute + azGpu + azStorage + azEgress;

  // Savings vs AWS baseline
  const savingsCents = Math.max(0, awsMonthlyCents - hyperCloudMonthlyCents);
  const savingsPercent = awsMonthlyCents > 0 ? Math.round((savingsCents / awsMonthlyCents) * 100) : 0;

  return {
    hyperCloudMonthlyCents,
    awsMonthlyCents,
    gcpMonthlyCents,
    azureMonthlyCents,
    savingsCents,
    savingsPercent,
    specs,
  };
}
