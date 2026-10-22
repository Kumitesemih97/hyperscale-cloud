"use client";

import React from "react";
import { NetworkGlobeCanvas } from "./NetworkGlobeCanvas";
import { 
  ArrowRight, 
  Server, 
  CheckCircle2, 
  ChevronRight
} from "lucide-react";

const TELEMETRY_METRICS = [
  { label: "High Availability SLA", value: "99.999%", subtext: "Contractual financial guarantee" },
  { label: "Global Backbone Capacity", value: "140+ Tbps", subtext: "Multi-terabit subsea mesh" },
  { label: "Intra-Cluster Latency", value: "< 1.2 µs", subtext: "InfiniBand Quantum-X800" },
  { label: "Confidential Compute", value: "100%", subtext: "Hardware AMD SEV / Intel TDX" },
];

const ENTERPRISE_CUSTOMERS = [
  { name: "Vertex Bio-Genomics", tier: "12,000 GPUs", workload: "Protein Folding" },
  { name: "Kinetic Autonomy", tier: "45 PB Fleet Telemetry", workload: "Vision Foundation Models" },
  { name: "Nexus Financial Global", tier: "99.999% SLA", workload: "Distributed Matching" },
  { name: "Orbital Dynamics", tier: "64-Region Mesh", workload: "Realtime Downlink" },
  { name: "Cognitive Synapse", tier: "8.2M QPS", workload: "Low-Latency Inference" },
];

export function Hero() {
  return (
    <section className="relative pt-16 pb-24 md:pt-24 md:pb-36 overflow-hidden border-b border-white/[0.06]" id="hero">
      {/* Studio Lighting Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#2997ff]/[0.08] via-transparent to-transparent blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & CTAs */}
          <div className="lg:col-span-7 space-y-8 text-left">
            {/* Apple Eyebrow Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#d1d1d6]">
              <span className="flex h-1.5 w-1.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#30d158] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#30d158]" />
              </span>
              <span className="text-[#f5f5f7]">B200 SXM6 Online</span>
              <span className="text-[#a1a1a6]">•</span>
              <span className="text-[#a1a1a6]">3.2 Tbps Quantum-X800 Fabric</span>
            </div>

            {/* Apple Keynote Headline: Two-Tone Typography */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] text-[#f5f5f7] leading-[1.08]">
                Aether Hyperscale. <br />
                <span className="text-[#a1a1a6]">
                  Pro performance at planet scale.
                </span>
              </h1>
              <p className="text-base sm:text-lg text-[#a1a1a6] max-w-2xl font-normal leading-relaxed">
                Architected from silicon up for distributed frontier AI and zero-downtime workloads.
                Single-tenant bare metal, hardware-enforced confidential enclaves, and sub-millisecond
                global optical routing across our private subsea fiber backbone.
              </p>
            </div>

            {/* Apple Pill Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <a
                href="#terminal"
                className="apple-btn-primary !px-6 !py-3 !text-sm"
              >
                <span>Deploy Cluster</span>
                <ChevronRight className="w-4 h-4 ml-1.5" />
              </a>

              <a
                href="#infrastructure"
                className="apple-btn-secondary !px-5 !py-3 !text-sm"
              >
                <Server className="w-4 h-4 text-[#a1a1a6] mr-2" />
                <span>Architecture Matrix</span>
              </a>
            </div>

            {/* Feature Guarantees */}
            <div className="pt-2 flex flex-wrap gap-y-2 gap-x-6 text-[12px] text-[#a1a1a6]">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158]" />
                <span>SOC 2 Type II & FedRAMP Ready</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158]" />
                <span>$300 Instant Cloud Credits</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#30d158]" />
                <span>Zero Egress Penalty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive 3D Globe with Apple Studio Glow */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full">
              <div className="absolute -inset-4 bg-white/[0.02] rounded-full blur-3xl -z-10" />
              <NetworkGlobeCanvas />
            </div>
          </div>
        </div>

        {/* Live Operational Telemetry Bento Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 apple-bento-card">
          {TELEMETRY_METRICS.map((metric, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#f5f5f7] tabular-numbers flex items-center gap-2">
                <span>{metric.value}</span>
                {idx === 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />}
              </div>
              <div className="text-[13px] font-medium text-[#f5f5f7]">{metric.label}</div>
              <div className="text-[11px] text-[#a1a1a6]">{metric.subtext}</div>
            </div>
          ))}
        </div>

        {/* Social Proof Enterprise Ticker */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <div className="text-[11px] font-medium text-[#a1a1a6] uppercase tracking-wider text-center mb-6">
            Mission-Critical Infrastructure Trusted Worldwide
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {ENTERPRISE_CUSTOMERS.map((cust, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-all text-center group"
              >
                <div className="text-[13px] font-medium text-[#f5f5f7] group-hover:text-white transition-colors">
                  {cust.name}
                </div>
                <div className="text-[11px] text-[#2997ff] font-mono mt-0.5">{cust.tier}</div>
                <div className="text-[11px] text-[#a1a1a6] mt-0.5">{cust.workload}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
