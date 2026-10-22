import React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { InfrastructureMatrix } from "@/components/infrastructure/InfrastructureMatrix";
import Link from "next/link";
import { Calculator, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Infrastructure Matrix | Aether Cloud",
  description: "Next-generation bare-metal compute, NVIDIA B200/H100 clusters, exabyte NVMe-oF storage, and 140+ Tbps global fabric.",
};

export default function InfrastructurePage() {
  return (
    <PageShell
      category="Compute & Fabric"
      title="Hyperscale Infrastructure Matrix"
      subtitle="Engineered for high-throughput AI model training, zero-loss RDMA storage networks, and deterministic sub-millisecond execution at planetary scale."
      telemetryMetric={{ label: "Active Nodes", value: "65,536", delta: "+12.4% MoM" }}
      badge="Hardware Nominal"
      actionButton={
        <Link
          href="/calculator"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-[#e5e5ea] text-xs font-semibold transition-all shadow-md"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Estimate Cluster TCO</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <InfrastructureMatrix />
    </PageShell>
  );
}

