import React, { Suspense } from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { CostEstimator } from "@/components/calculator/CostEstimator";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "TCO Cost Estimator | Aether Cloud",
  description: "Real-time enterprise TCO modeling comparing hyperscale workloads against AWS, GCP, and Azure with integer-cents accuracy.",
};

export default function CalculatorPage() {
  return (
    <PageShell
      category="Financial Engineering"
      title="Hyperscale Enterprise TCO Estimator"
      subtitle="Model multi-cluster cloud economics with transparent integer-cents arithmetic. Direct bill-of-materials comparison against AWS EC2, GCP Compute Engine, and Azure VMs."
      telemetryMetric={{ label: "Average Savings", value: "48.2%", delta: "Guaranteed SLA" }}
      badge="Financial Realtime"
      actionButton={
        <Link
          href="/infrastructure"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-[#e5e5ea] text-xs font-semibold transition-all shadow-md"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>View Hardware Specs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <Suspense fallback={<div className="h-96 animate-pulse bg-white/5 rounded-[22px]" />}>
        <CostEstimator />
      </Suspense>
    </PageShell>
  );
}

