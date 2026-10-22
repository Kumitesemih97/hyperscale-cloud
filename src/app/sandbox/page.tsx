import React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { SandboxTerminal } from "@/components/terminal/SandboxTerminal";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "IaC Terminal Sandbox | Aether Cloud",
  description: "Declarative cloud orchestration simulator with Terraform, Pulumi, and Aether CLI syntax compilation.",
};

export default function SandboxPage() {
  return (
    <PageShell
      category="Developer Experience"
      title="Interactive IaC Sandbox & Orchestration Terminal"
      subtitle="Compile and simulate cluster deployment plans with zero risk. Deterministic AST parsing and synthetic dry-runs across Terraform, Pulumi, and Native CLI."
      telemetryMetric={{ label: "Simulation Engine", value: "DFA AST v2.4", delta: "0 Eval Invariant" }}
      badge="Sandbox Ready"
      actionButton={
        <Link
          href="/security"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-[#e5e5ea] text-xs font-semibold transition-all shadow-md"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Security & Attestation</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      }
    >
      <SandboxTerminal />
    </PageShell>
  );
}

