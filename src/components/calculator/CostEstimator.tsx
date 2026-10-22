"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { calculateTCO, type Specs, MIN_SPECS, MAX_SPECS } from "../../core/pricing/tco";
import { parseSpecsFromUrl, SKU_PRESETS } from "../../core/pricing/presets";
import { 
  Calculator, 
  TrendingDown, 
  Cpu, 
  HardDrive, 
  Layers, 
  Zap, 
  ChevronRight,
  Sparkles
} from "lucide-react";

function useAnimatedNumber(target: number, durationMs = 350) {
  const [displayValue, setDisplayValue] = useState(target);
  const currentRef = useRef(target);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const initialValue = currentRef.current;
    const delta = target - initialValue;
    if (delta === 0) return;

    let animId: number;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);
      // Apple ease-out curve
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(initialValue + delta * easeProgress);
      currentRef.current = nextVal;
      setDisplayValue(nextVal);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [target, durationMs]);

  return displayValue;
}

export function CostEstimator() {
  const [specs, setSpecs] = useState<Specs>({
    vcpu: 128,
    gpuCount: 8,
    storageTb: 25,
    egressTb: 50,
  });

  // Cross-component deep linking: Sync with URL hash
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.includes("calculator")) {
        setSpecs((current) => parseSpecsFromUrl(hash, current));
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const tco = useMemo(() => calculateTCO(specs), [specs]);
  const animatedMonthlyCents = useAnimatedNumber(tco.hyperCloudMonthlyCents);
  const animatedSavingsCents = useAnimatedNumber(tco.savingsCents);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(cents / 100);
  };

  const handleSliderChange = (field: keyof Specs, value: number) => {
    setSpecs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const applyPreset = (presetKey: string) => {
    const preset = SKU_PRESETS[presetKey];
    if (preset) {
      setSpecs({
        vcpu: preset.vcpu,
        gpuCount: preset.gpuCount,
        storageTb: preset.storageTb,
        egressTb: preset.egressTb,
      });
    }
  };

  return (
    <section className="py-24 border-b border-white/[0.06] relative" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Apple Keynote Style */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#a1a1a6]">
            <Calculator className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>TCO Estimator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Transparent Pricing. Built for Scale.
          </h2>
          <p className="text-base sm:text-lg text-[#a1a1a6] leading-relaxed">
            Compare monthly operational infrastructure expenditures against legacy cloud providers.
            Save up to 60% on compute and eliminate egress taxes.
          </p>

          {/* Quick Hardware SKU Presets Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#a1a1a6] mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#2997ff]" />
              <span>Architectural Presets:</span>
            </span>
            <button
              onClick={() => applyPreset("b200-cluster")}
              className="apple-segmented-item !text-xs !py-1 !px-3 hover:text-white"
            >
              NVIDIA B200 SXM6 (8 GPUs)
            </button>
            <button
              onClick={() => applyPreset("bare-metal-epyc")}
              className="apple-segmented-item !text-xs !py-1 !px-3 hover:text-white"
            >
              AMD EPYC 9654 (192 Cores)
            </button>
            <button
              onClick={() => applyPreset("serverless-microvm")}
              className="apple-segmented-item !text-xs !py-1 !px-3 hover:text-white"
            >
              MicroVM Serverless (32 vCPU)
            </button>
            <button
              onClick={() => applyPreset("nvme-block")}
              className="apple-segmented-item !text-xs !py-1 !px-3 hover:text-white"
            >
              NVMe Ultra Block (100 TB)
            </button>
          </div>
        </div>

        {/* Calculator Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Sliders in Apple Bento Card */}
          <div className="lg:col-span-7 p-6 sm:p-8 apple-bento-card space-y-8">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
              <h3 className="text-[17px] font-semibold text-[#f5f5f7] tracking-tight">Cluster Resource Allocation</h3>
              <span className="text-xs font-mono text-[#a1a1a6]">Realtime Engine</span>
            </div>

            {/* Slider 1: vCPU */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="vcpu-slider" className="text-sm font-medium text-[#f5f5f7] flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#2997ff]" />
                  <span>Compute Capacity (vCPU)</span>
                </label>
                <span className="font-mono text-xs font-medium text-[#f5f5f7] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 tabular-numbers">
                  {specs.vcpu} vCPUs
                </span>
              </div>
              <input
                id="vcpu-slider"
                type="range"
                min={MIN_SPECS.vcpu}
                max={MAX_SPECS.vcpu}
                step={4}
                value={specs.vcpu}
                onChange={(e) => handleSliderChange("vcpu", Number(e.target.value))}
                className="w-full accent-white h-2 bg-[#2c2c2e] rounded-full cursor-pointer"
                aria-label="Compute vCPU units"
                aria-valuemin={MIN_SPECS.vcpu}
                aria-valuemax={MAX_SPECS.vcpu}
                aria-valuenow={specs.vcpu}
              />
              <div className="flex justify-between text-[11px] font-mono text-[#a1a1a6]">
                <span>{MIN_SPECS.vcpu} vCPU</span>
                <span>512 vCPU</span>
                <span>{MAX_SPECS.vcpu} vCPU</span>
              </div>
            </div>

            {/* Slider 2: GPU Count */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="gpu-slider" className="text-sm font-medium text-[#f5f5f7] flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#2997ff]" />
                  <span>Frontier AI GPUs (NVIDIA B200 / H100)</span>
                </label>
                <span className="font-mono text-xs font-medium text-[#2997ff] px-2.5 py-1 rounded-full bg-[#2997ff]/10 border border-[#2997ff]/30 tabular-numbers">
                  {specs.gpuCount} SXM6 GPUs
                </span>
              </div>
              <input
                id="gpu-slider"
                type="range"
                min={MIN_SPECS.gpuCount}
                max={MAX_SPECS.gpuCount}
                step={2}
                value={specs.gpuCount}
                onChange={(e) => handleSliderChange("gpuCount", Number(e.target.value))}
                className="w-full accent-[#2997ff] h-2 bg-[#2c2c2e] rounded-full cursor-pointer"
                aria-label="GPU accelerator count"
                aria-valuemin={MIN_SPECS.gpuCount}
                aria-valuemax={MAX_SPECS.gpuCount}
                aria-valuenow={specs.gpuCount}
              />
              <div className="flex justify-between text-[11px] font-mono text-[#a1a1a6]">
                <span>0 GPUs</span>
                <span>32 GPUs</span>
                <span>{MAX_SPECS.gpuCount} GPUs</span>
              </div>
            </div>

            {/* Slider 3: NVMe Storage */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="storage-slider" className="text-sm font-medium text-[#f5f5f7] flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-[#30d158]" />
                  <span>NVMe-oF Ultra Block Storage</span>
                </label>
                <span className="font-mono text-xs font-medium text-[#f5f5f7] px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/10 tabular-numbers">
                  {specs.storageTb} TB NVMe
                </span>
              </div>
              <input
                id="storage-slider"
                type="range"
                min={MIN_SPECS.storageTb}
                max={MAX_SPECS.storageTb}
                step={5}
                value={specs.storageTb}
                onChange={(e) => handleSliderChange("storageTb", Number(e.target.value))}
                className="w-full accent-white h-2 bg-[#2c2c2e] rounded-full cursor-pointer"
                aria-label="NVMe storage capacity in Terabytes"
                aria-valuemin={MIN_SPECS.storageTb}
                aria-valuemax={MAX_SPECS.storageTb}
                aria-valuenow={specs.storageTb}
              />
              <div className="flex justify-between text-[11px] font-mono text-[#a1a1a6]">
                <span>{MIN_SPECS.storageTb} TB</span>
                <span>250 TB</span>
                <span>{MAX_SPECS.storageTb} TB</span>
              </div>
            </div>

            {/* Slider 4: Egress Bandwidth */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label htmlFor="egress-slider" className="text-sm font-medium text-[#f5f5f7] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#ffd60a]" />
                  <span>Monthly Internet Egress Traffic</span>
                </label>
                <span className="font-mono text-xs font-medium text-[#ffd60a] px-2.5 py-1 rounded-full bg-[#ffd60a]/10 border border-[#ffd60a]/20 tabular-numbers">
                  {specs.egressTb} TB Egress
                </span>
              </div>
              <input
                id="egress-slider"
                type="range"
                min={MIN_SPECS.egressTb}
                max={MAX_SPECS.egressTb}
                step={10}
                value={specs.egressTb}
                onChange={(e) => handleSliderChange("egressTb", Number(e.target.value))}
                className="w-full accent-[#ffd60a] h-2 bg-[#2c2c2e] rounded-full cursor-pointer"
                aria-label="Monthly egress bandwidth in Terabytes"
                aria-valuemin={MIN_SPECS.egressTb}
                aria-valuemax={MAX_SPECS.egressTb}
                aria-valuenow={specs.egressTb}
              />
              <div className="flex justify-between text-[11px] font-mono text-[#a1a1a6]">
                <span>{MIN_SPECS.egressTb} TB (20TB Free)</span>
                <span>500 TB</span>
                <span>{MAX_SPECS.egressTb} TB</span>
              </div>
            </div>
          </div>

          {/* Right Column: Comparative TCO Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 apple-bento-card space-y-6">
            <div>
              <span className="text-[11px] font-medium text-[#a1a1a6] uppercase tracking-wider">
                Estimated Monthly Spend
              </span>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#f5f5f7] tabular-numbers">
                  {formatCurrency(animatedMonthlyCents)}
                </span>
                <span className="text-xs font-mono text-[#a1a1a6]">/ mo</span>
              </div>
            </div>

            {/* Savings Callout Box */}
            <div className="apple-inner-card p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-xl bg-[#30d158]/10 text-[#30d158]">
                  <TrendingDown className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#30d158]">
                    Annual Projected Savings
                  </div>
                  <div className="text-base font-semibold text-[#f5f5f7] tabular-numbers">
                    {formatCurrency(animatedSavingsCents * 12)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-[#30d158] font-semibold">
                  -{tco.savingsPercent}%
                </div>
                <div className="text-[10px] text-[#a1a1a6]">vs AWS On-Demand</div>
              </div>
            </div>

            {/* Competitor Price Comparison Bars */}
            <div className="space-y-4 pt-2">
              <div className="text-[11px] font-medium text-[#a1a1a6] uppercase tracking-wider">
                Hyperscale Benchmark Comparison
              </div>

              {/* Aether Cloud */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-[#f5f5f7] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2997ff]" />
                    Aether Cloud
                  </span>
                  <span className="font-mono font-medium text-[#2997ff] tabular-numbers">
                    {formatCurrency(animatedMonthlyCents)}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2997ff] to-[#5dd8ff] rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (tco.hyperCloudMonthlyCents / tco.awsMonthlyCents) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* AWS */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#a1a1a6]">
                  <span>Amazon Web Services (ec2 + ebs + egress)</span>
                  <span className="font-mono tabular-numbers text-[#d1d1d6]">{formatCurrency(tco.awsMonthlyCents)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full bg-[#a1a1a6]/40 rounded-full w-full" />
                </div>
              </div>

              {/* Google Cloud */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#a1a1a6]">
                  <span>Google Cloud Platform (a3 + persistent disk)</span>
                  <span className="font-mono tabular-numbers text-[#d1d1d6]">{formatCurrency(tco.gcpMonthlyCents)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-[#a1a1a6]/40 rounded-full"
                    style={{ width: `${Math.min(100, (tco.gcpMonthlyCents / tco.awsMonthlyCents) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Microsoft Azure */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#a1a1a6]">
                  <span>Microsoft Azure (ndv5 + premium ssd)</span>
                  <span className="font-mono tabular-numbers text-[#d1d1d6]">{formatCurrency(tco.azureMonthlyCents)}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div
                    className="h-full bg-[#a1a1a6]/40 rounded-full"
                    style={{ width: `${Math.min(100, (tco.azureMonthlyCents / tco.awsMonthlyCents) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Disclaimer & Action */}
            <div className="pt-4 border-t border-white/[0.06] space-y-4">
              <div className="text-[11px] text-[#a1a1a6] leading-relaxed">
                Calculations compare on-demand baseline rates as of current quarter.
                Egress includes first 20TB complimentary bandwidth per cluster.
              </div>

              <a
                href="#terminal"
                className="apple-btn-primary w-full text-center !py-3 !text-sm"
              >
                <span>Deploy with This Specification</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
