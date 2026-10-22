import React from "react";
import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ComplianceGrid } from "@/components/compliance/ComplianceGrid";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Trust, Security & Compliance | Aether Cloud",
  description: "Enterprise zero-trust architecture, cryptographic attestation, hardware-isolated enclaves, SOC 2 Type II, ISO 27001, and FedRAMP High compliance.",
};

export default function SecurityPage() {
  return (
    <PageShell
      category="Governance & Assurance"
      title="Trust, Compliance & Zero-Trust Architecture"
      subtitle="Military-grade hardware-enforced isolation, confidential computing enclaves (AMD SEV-SNP / Intel TDX), and continuously audited compliance posture."
      telemetryMetric={{ label: "Attestation Status", value: "100% Cryptographic", delta: "Zero Exceptions" }}
      badge="Zero-Trust Enforced"
      actionButton={
        <div className="flex items-center gap-3">
          <Link
            href="/infrastructure"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-[#e5e5ea] text-xs font-semibold transition-all shadow-md"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Hardware Enclaves</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      }
    >
      <div className="space-y-12">
        {/* Dynamic Security & CSP Proof Card */}
        <div
          className="p-6 rounded-[22px] bg-[#0c0c0e]/80 border border-white/10 backdrop-blur-xl"
          style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)" }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-[#30d158]/10 border border-[#30d158]/20 text-[#30d158]">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Browser & Edge Defense Invariants</h3>
                <p className="text-xs text-[#86868b]">Active HTTP response security policies and client isolation guarantees</p>
              </div>
            </div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-[#30d158]">
              <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
              <span>Mozilla Observatory Grade A+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[#86868b] text-[11px] mb-1">Content-Security-Policy</div>
              <div className="text-[#f5f5f7] font-medium">default-src &apos;self&apos;; frame-ancestors &apos;none&apos;</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[#86868b] text-[11px] mb-1">Clickjacking Defense</div>
              <div className="text-[#30d158] font-medium">X-Frame-Options: DENY</div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="text-[#86868b] text-[11px] mb-1">Transport Security</div>
              <div className="text-[#2997ff] font-medium">HSTS 2-Year Preload</div>
            </div>
          </div>
        </div>

        {/* Existing Full Compliance Grid */}
        <ComplianceGrid />
      </div>
    </PageShell>
  );
}

