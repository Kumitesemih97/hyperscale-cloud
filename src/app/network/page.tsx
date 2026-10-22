import React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { GlobalNetworkVisualizer } from "@/components/network/GlobalNetworkVisualizer";
import Link from "next/link";
import { Terminal, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Global Network Fabric | Aether Cloud",
  description: "140+ Tbps software-defined subsea mesh, edge points of presence in 42 metro regions, and sub-millisecond local transit.",
};

export default function NetworkPage() {
  return (
    <PageShell
      category="Edge & Routing"
      title="Global Photonic Network Fabric"
      subtitle="Geodesic subsea fiber backbones and Layer 7 anycast edge routing. Real-time packet telemetry and synthetic Haversine propagation monitoring."
      telemetryMetric={{ label: "Transit Capacity", value: "142.8 Tbps", delta: "100% Backbone SLA" }}
      badge="Backbone Nominal"
      actionButton={
        <Link
          href="/sandbox"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-[#e5e5ea] text-xs font-semibold transition-all shadow-md"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Launch Edge Sandbox</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <GlobalNetworkVisualizer />
    </PageShell>
  );
}

