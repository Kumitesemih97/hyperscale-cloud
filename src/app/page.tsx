import React from "react";
import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { InfrastructureMatrix } from "@/components/infrastructure/InfrastructureMatrix";
import { SandboxTerminal } from "@/components/terminal/SandboxTerminal";
import { ComplianceGrid } from "@/components/compliance/ComplianceGrid";
import { CostEstimator } from "@/components/calculator/CostEstimator";
import { GlobalNetworkVisualizer } from "@/components/network/GlobalNetworkVisualizer";
import { Cpu, Globe, Terminal, Calculator, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const workspaces = [
    {
      title: "Infrastructure Matrix",
      desc: "NVIDIA B200 SXM6 superclusters, dual AMD EPYC bare metal, and NVMe-oF fabrics.",
      href: "/infrastructure",
      icon: <Cpu className="w-5 h-5 text-[#2997ff]" />,
      badge: "65,536 Nodes",
      accent: "hover:border-[#2997ff]/40",
    },
    {
      title: "Global Photonic Fabric",
      desc: "140+ Tbps subsea mesh, edge routing across 42 metro PoPs, and sub-ms transit.",
      href: "/network",
      icon: <Globe className="w-5 h-5 text-[#30d158]" />,
      badge: "140+ Tbps",
      accent: "hover:border-[#30d158]/40",
    },
    {
      title: "IaC Terminal Sandbox",
      desc: "Simulate Terraform, Pulumi, and CLI cluster deployments with zero execution risk.",
      href: "/sandbox",
      icon: <Terminal className="w-5 h-5 text-[#ffd60a]" />,
      badge: "DFA AST Safe",
      accent: "hover:border-[#ffd60a]/40",
    },
    {
      title: "TCO Cost Estimator",
      desc: "Transparent integer-cents economic modeling vs AWS, GCP, and Azure.",
      href: "/calculator",
      icon: <Calculator className="w-5 h-5 text-[#ff375f]" />,
      badge: "48% Avg Savings",
      accent: "hover:border-[#ff375f]/40",
    },
    {
      title: "Trust & Zero-Trust",
      desc: "Cryptographic hardware enclaves (SEV-SNP/TDX), FedRAMP High, and SOC 2 Type II.",
      href: "/security",
      icon: <ShieldCheck className="w-5 h-5 text-[#bf5af2]" />,
      badge: "Observatory A+",
      accent: "hover:border-[#bf5af2]/40",
    },
  ];

  return (
    <main className="w-full flex flex-col justify-between selection:bg-[#0071e3]/30 selection:text-white">
      <Hero />

      {/* Platform Workspace Navigation Portal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-mono text-[#2997ff] uppercase tracking-wider mb-2">
              Architecture Hub
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dedicated Engineering Workspaces
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#86868b] max-w-md">
            Explore focused, standalone telemetry consoles engineered for high-throughput model training, fiber routing, and cost modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workspaces.map((ws) => (
            <Link
              key={ws.href}
              href={ws.href}
              className={`p-6 rounded-[22px] bg-[#0c0c0e]/80 border border-white/[0.08] backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between ${ws.accent}`}
              style={{ boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.08)" }}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    {ws.icon}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#a1a1a6] border border-white/10">
                    {ws.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white group-hover:text-white transition-colors mb-2">
                  {ws.title}
                </h3>
                <p className="text-xs text-[#86868b] leading-relaxed mb-6">
                  {ws.desc}
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2997ff] group-hover:translate-x-1 transition-transform">
                <span>Enter Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Anchor Sections */}
      <InfrastructureMatrix />
      <SandboxTerminal />
      <ComplianceGrid />
      <CostEstimator />
      <GlobalNetworkVisualizer />
    </main>
  );
}
