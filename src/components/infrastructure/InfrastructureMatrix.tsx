"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Cpu, 
  HardDrive, 
  BrainCircuit, 
  Network, 
  Check, 
  Zap, 
  Activity,
  Layers,
  Server,
  ChevronRight
} from "lucide-react";

type CategoryKey = "compute" | "storage" | "aiml" | "networking";

interface MatrixItem {
  id: string;
  name: string;
  badge: string;
  specs: { label: string; value: string }[];
  description: string;
  architecture: string[];
  benchmark: string;
}

const MATRIX_DATA: Record<CategoryKey, { title: string; subtitle: string; icon: React.ReactNode; items: MatrixItem[] }> = {
  compute: {
    title: "Accelerated & Bare-Metal Compute",
    subtitle: "Custom silicon, dense GPU clusters, and single-tenant bare-metal with microsecond hypervisors.",
    icon: <Cpu className="w-4 h-4 text-[#2997ff]" />,
    items: [
      {
        id: "b200-cluster",
        name: "NVIDIA B200 SXM6 AI Supernodes",
        badge: "Next-Gen Flagship",
        description: "Eight NVIDIA B200 Tensor Core GPUs with 1.5TB HBM3e memory and 3.2Tbps Quantum-X800 InfiniBand per node.",
        specs: [
          { label: "GPU Memory", value: "1,536 GB HBM3e" },
          { label: "Memory Bandwidth", value: "64 TB/sec Aggregate" },
          { label: "Interconnect", value: "1.8 TB/s NVLink 5th Gen" },
          { label: "FP8 Compute", value: "144 PFLOPS" },
        ],
        architecture: [
          "Direct liquid-to-chip CDU cooling architecture",
          "Dedicated 3.2 Tbps dual-port InfiniBand host adapters",
          "Hardware-enforced AMD SEV-SNP confidential VM isolation",
        ],
        benchmark: "3.5x faster LLM inference throughput vs H100 SXM5",
      },
      {
        id: "bare-metal-epyc",
        name: "Dual AMD EPYC 9654 Genoa Bare Metal",
        badge: "Pure Silicon",
        description: "192 physical Zen 4 cores (384 threads), 3.0TB DDR5 ECC memory, and 60TB PCIe 5.0 NVMe local storage.",
        specs: [
          { label: "Physical Cores", value: "192 Cores / 384 Threads" },
          { label: "Memory", value: "3,072 GB DDR5-4800 ECC" },
          { label: "Local NVMe", value: "8x 7.68TB PCIe 5.0 U.2" },
          { label: "Networking", value: "2x 200Gbps RoCEv2 LACP" },
        ],
        architecture: [
          "Zero hypervisor noise and zero noisy-neighbor degradation",
          "Raw hardware register access and custom BIOS tuning profiles",
          "100% root-level IPMI/BMC Out-of-band management console",
        ],
        benchmark: "Under 1.8µs memory access latency with zero virtualization overhead",
      },
      {
        id: "serverless-microvm",
        name: "Autonomous MicroVM Serverless Runtimes",
        badge: "5ms Cold Start",
        description: "Rust-based Firecracker microVMs isolated at kernel level with instantaneous sub-5ms scale-from-zero execution.",
        specs: [
          { label: "Cold Start Time", value: "< 5 ms Guaranteed" },
          { label: "Concurrency", value: "500,000 req/sec instantaneous" },
          { label: "Billing Granularity", value: "1 Millisecond" },
          { label: "Architecture", value: "x86_64 & Arm64 Neoverse V2" },
        ],
        architecture: [
          "Pre-warmed memory snapshots with copy-on-write page sharing",
          "Stateless anycast routing directs incoming packets to nearest microVM",
          "Per-tenant cgroup v2 resource accounting and memory sandboxing",
        ],
        benchmark: "12x lower execution latency than legacy serverless lambdas",
      },
    ],
  },
  storage: {
    title: "Exabyte Storage & Zero-Lag Databases",
    subtitle: "NVMe-over-Fabrics block storage, infinite object storage, and globally distributed ACID databases.",
    icon: <HardDrive className="w-4 h-4 text-[#f5f5f7]" />,
    items: [
      {
        id: "nvme-block",
        name: "Distributed NVMe-oF Ultra Block Storage",
        badge: "18.4M IOPS",
        description: "PCIe Gen5 storage over converged Ethernet with synchronous multi-AZ striping and zero replication lag.",
        specs: [
          { label: "Peak Read IOPS", value: "18,400,000 IOPS / Vol" },
          { label: "Sequential Throughput", value: "64 GB/sec per instance" },
          { label: "Write Latency", value: "< 45 µs P99.9" },
          { label: "Data Durability", value: "99.999999999% (11 9s)" },
        ],
        architecture: [
          "RDMA over Converged Ethernet (RoCE v2) storage transport",
          "Hardware inline transparent AES-256-XTS cryptographic encryption",
          "Zero-copy userspace SPDK kernel bypass architecture",
        ],
        benchmark: "10x lower P99 write tail latency than standard cloud EBS",
      },
      {
        id: "s3-object",
        name: "Global Anycast S3-Compatible Object Store",
        badge: "Infinite Scale",
        description: "Multi-region distributed object fabric with single global namespace, geo-replication, and zero egress taxes.",
        specs: [
          { label: "Time to First Byte", value: "< 12 ms Globally" },
          { label: "Single Object Max", value: "10 Terabytes" },
          { label: "Availability", value: "99.99% Dual-Region" },
          { label: "Egress Bandwidth", value: "Free Zero-Cost Egress" },
        ],
        architecture: [
          "Erasure-coded 16+4 block distribution across distinct metro power zones",
          "Sub-millisecond metadata cache backed by distributed memory fabric",
          "Native S3 API compatibility with zero SDK changes required",
        ],
        benchmark: "98% lower egress cost than hyperscale incumbents",
      },
      {
        id: "spanner-db",
        name: "Globally Distributed ACID SQL (Spanner Class)",
        badge: "Atomic Clocks",
        description: "Distributed relational database with TrueTime hardware atomic clock synchronization and external consistency.",
        specs: [
          { label: "Clock Uncertainty (ε)", value: "< 200 Nanoseconds" },
          { label: "Cross-Region Commit", value: "< 22 ms Two-Phase" },
          { label: "Replication Topology", value: "Paxos 5-Region Quorum" },
          { label: "SQL Dialect", value: "ANSI SQL-2016 Compliant" },
        ],
        architecture: [
          "GPS and rubidium atomic clocks installed in every flagship datacenter",
          "Hardware-synchronized timestamp oracle for lock-free read transactions",
          "Automatic horizontal sharding and live online re-indexing",
        ],
        benchmark: "Zero read-stale transactions under simulated inter-region partition",
      },
    ],
  },
  aiml: {
    title: "AI Training & Inference Superclusters",
    subtitle: "Turnkey distributed training pods, vLLM-accelerated inference endpoints, and automated weight sharding.",
    icon: <BrainCircuit className="w-4 h-4 text-[#30d158]" />,
    items: [
      {
        id: "training-pods",
        name: "Megawatt Megacluster Training Pods",
        badge: "32,768 GPUs",
        description: "Turnkey AI training clusters connected via 3.2Tbps non-blocking Quantum-X800 InfiniBand fat-tree topology.",
        specs: [
          { label: "Fabric Bisection Bandwidth", value: "104.8 Pbps Non-blocking" },
          { label: "AllReduce Efficiency", value: "97.4% at 16k GPU Scale" },
          { label: "Checkpoint Bandwidth", value: "12 TB/sec Parallel Burst" },
          { label: "Fault Recovery", value: "< 90 sec Node Eviction" },
        ],
        architecture: [
          "Automated Slurm / Kubernetes orchestrator with NCCL optimizations",
          "Proactive optical transceiver health telemetry and hot-spare swap",
          "Direct integration with fast GPUDirect Storage (GDS) Lustre filesystems",
        ],
        benchmark: "Trained 70B parameter model in 4.2 days with zero manual restarts",
      },
      {
        id: "inference-fleet",
        name: "Low-Latency Global Inference Endpoints",
        badge: "Sub-15ms TTFT",
        description: "Serverless vLLM inference gateways deployed across 64 global edge PoPs with dynamic continuous batching.",
        specs: [
          { label: "Time To First Token", value: "< 14 ms (Llama 3 70B)" },
          { label: "Tokens / Second", value: "240 tok/s per stream" },
          { label: "Speculative Decoding", value: "Integrated Draft Models" },
          { label: "Model Caching", value: "100% NVMe Hot-Memory" },
        ],
        architecture: [
          "PagedAttention v2 kernel integration with FP8 quantized weight caches",
          "Intelligent prompt cache routing redirects duplicate system prompts to warm GPU memory",
          "OpenAI-compatible API with zero drop-in code modifications",
        ],
        benchmark: "4.8x higher tokens-per-dollar efficiency vs standard cloud providers",
      },
      {
        id: "vector-engine",
        name: "Hardware-Accelerated Vector Knowledge Engine",
        badge: "HNSW on GPU",
        description: "Ultra-low-latency semantic vector database executing HNSW index searches directly on GPU tensor cores.",
        specs: [
          { label: "Vector Search P99", value: "< 1.2 ms over 500M vectors" },
          { label: "Recall Rate", value: "99.8% Recall@10" },
          { label: "Index Updates", value: "Realtime zero-downtime insert" },
          { label: "Dimension Support", value: "Up to 8,192 Dimensions" },
        ],
        architecture: [
          "GPU-resident graph navigation utilizing CUDA Graph dispatching",
          "Hybrid sparse-dense retrieval with reciprocal rank fusion (RRF)",
          "Enterprise multi-tenant namespace partitioning with zero leakage",
        ],
        benchmark: "10M queries per second on a single 8-GPU node",
      },
    ],
  },
  networking: {
    title: "140+ Tbps Global Optical Fabric",
    subtitle: "Private dark fiber backbone, anycast BGP routing, and automated DDoS mitigation at wire speed.",
    icon: <Network className="w-4 h-4 text-[#ffd60a]" />,
    items: [
      {
        id: "fiber-backbone",
        name: "Private Dark Fiber & Subsea Terabit Mesh",
        badge: "140+ Tbps Capacity",
        description: "Wholly owned trans-oceanic and trans-continental optical fiber mesh with guaranteed latency SLAs.",
        specs: [
          { label: "Core Backbone", value: "140+ Tbps Dedicated Fiber" },
          { label: "Subsea Routes", value: "8 Dedicated Cable Systems" },
          { label: "Packet Loss Rate", value: "< 0.001% Global P99" },
          { label: "Route Convergence", value: "< 15 ms Fast Reroute" },
        ],
        architecture: [
          "Coherent optical transceivers operating at 800Gbps per wavelength",
          "Segment Routing over IPv6 (SRv6) for programmatic traffic steering",
          "Automated optical path self-healing with zero TCP session drop",
        ],
        benchmark: "64ms Round-trip Transatlantic latency between IAD and LHR",
      },
      {
        id: "ddos-shield",
        name: "Autonomous Layer 3/4/7 DDoS Shield",
        badge: "Instant Scrubbing",
        description: "Edge-based scrubbing centers capable of absorbing multi-terabit volumetric attacks in under 500ms.",
        specs: [
          { label: "Scrubbing Capacity", value: "120 Tbps Edge Mitigation" },
          { label: "Mitigation Time", value: "< 350 ms Automated" },
          { label: "Layer 7 Shield", value: "eBPF Kernel-level Filter" },
          { label: "SLA", value: "100% Availability Protection" },
        ],
        architecture: [
          "eBPF/XDP packet inspection running directly at network interface card",
          "Real-time machine learning threat behavioral anomaly classification",
          "Zero human intervention required for SYN/UDP/DNS flood mitigation",
        ],
        benchmark: "Defeated 3.4 Tbps DDoS attack with 0.0ms customer latency increase",
      },
    ],
  },
};

export function InfrastructureMatrix() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("compute");

  const category = MATRIX_DATA[activeCategory];

  return (
    <section className="py-24 border-b border-white/[0.06] relative" id="infrastructure">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Apple Keynote Style */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#a1a1a6]">
            <span>Architecture Matrix</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Engineered for Extreme Workloads.
          </h2>
          <p className="text-base sm:text-lg text-[#a1a1a6] leading-relaxed">
            Every layer stripped of legacy virtualization overhead and built from silicon to
            fiber for uncompromising speed, determinism, and scale.
          </p>
        </div>

        {/* Tab Selection Navigation: Apple Segmented Pill Track */}
        <div className="mt-12 flex justify-center">
          <div
            role="tablist"
            aria-label="Core Infrastructure Categories"
            className="apple-segmented-track"
          >
            {(Object.keys(MATRIX_DATA) as CategoryKey[]).map((key) => {
              const item = MATRIX_DATA[key];
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={`apple-segmented-item flex items-center space-x-2 ${isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span>{item.title.split("&")[0].trim()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Subtitle Banner */}
        <div className="mt-6 text-center text-xs font-mono text-[#a1a1a6] max-w-2xl mx-auto">
          {category.subtitle}
        </div>

        {/* Matrix Bento Grid Cards */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.items.map((item) => (
            <div
              key={item.id}
              className="apple-bento-card flex flex-col justify-between p-6 sm:p-7 group"
            >
              <div className="space-y-4">
                {/* Header & Badge */}
                <div className="flex items-start justify-between">
                  <h3 className="text-[17px] font-semibold text-[#f5f5f7] tracking-tight group-hover:text-white transition-colors">
                    {item.name}
                  </h3>
                </div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[10px] font-medium text-[#2997ff]">
                  {item.badge}
                </div>
                <p className="text-xs text-[#a1a1a6] leading-relaxed">{item.description}</p>

                {/* Specs Grid: Apple Inner Cards */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/[0.06]">
                  {item.specs.map((spec, sIdx) => (
                    <div key={sIdx} className="apple-inner-card p-2.5">
                      <div className="text-[10px] text-[#a1a1a6] font-mono">{spec.label}</div>
                      <div className="text-xs font-medium text-[#f5f5f7] mt-0.5 tabular-numbers">{spec.value}</div>
                    </div>
                  ))}
                </div>

                {/* Architecture Invariants */}
                <div className="space-y-1.5 pt-2">
                  <div className="text-[10px] font-medium text-[#a1a1a6] uppercase tracking-wider">
                    Architectural Invariants
                  </div>
                  {item.architecture.map((arch, aIdx) => (
                    <div key={aIdx} className="flex items-start space-x-2 text-xs text-[#d1d1d6]">
                      <Check className="w-3.5 h-3.5 text-[#30d158] mt-0.5 shrink-0" />
                      <span>{arch}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benchmark Footnote & Deep Link CTA */}
              <div className="mt-6 pt-3 border-t border-white/[0.06] space-y-3">
                <div className="flex items-center text-[11px] font-mono text-[#a1a1a6]">
                  <Activity className="w-3.5 h-3.5 text-[#2997ff] mr-1.5 shrink-0" />
                  <span className="truncate">{item.benchmark}</span>
                </div>
                <Link
                  href={`/calculator?sku=${item.id}`}
                  className="w-full apple-btn-secondary !py-2 !text-xs font-mono flex items-center justify-center gap-1.5 group-hover:border-[#2997ff]/40"
                >
                  <span>Configure & Estimate TCO</span>
                  <ChevronRight className="w-3.5 h-3.5 text-[#2997ff]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
