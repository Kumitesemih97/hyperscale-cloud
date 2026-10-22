"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Activity, ShieldCheck } from "lucide-react";

export interface PageShellProps {
  category: string;
  title: string;
  subtitle: string;
  telemetryMetric?: {
    label: string;
    value: string;
    delta?: string;
  };
  badge?: string;
  actionButton?: React.ReactNode;
  children: React.ReactNode;
}

export function PageShell({
  category,
  title,
  subtitle,
  telemetryMetric,
  badge = "Nominal",
  actionButton,
  children,
}: PageShellProps) {
  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
      {/* Telemetry & Breadcrumb Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.06] pb-6 mb-10">
        <div className="flex items-center space-x-2 text-xs font-mono text-[#86868b]">
          <Link href="/" className="hover:text-white transition-colors">
            Aether
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
          <span className="text-[#a1a1a6] font-medium">{category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#555]" />
          <span className="text-[#2997ff]">{title}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#30d158]/10 border border-[#30d158]/20 text-[#30d158] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse" />
            <span>{badge}</span>
          </div>

          {telemetryMetric && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono">
              <Activity className="w-3.5 h-3.5 text-[#2997ff]" />
              <span className="text-[#86868b]">{telemetryMetric.label}:</span>
              <span className="text-white font-semibold tabular-nums">
                {telemetryMetric.value}
              </span>
              {telemetryMetric.delta && (
                <span className="text-[#30d158] text-[11px] font-medium">
                  {telemetryMetric.delta}
                </span>
              )}
            </div>
          )}

          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-[#86868b]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
            <span>Encrypted TEE</span>
          </div>
        </div>
      </div>

      {/* Header Stage */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
        <div className="max-w-3xl">
          <div className="inline-block px-3 py-1 rounded-full text-[11px] font-mono text-[#2997ff] bg-[#2997ff]/10 border border-[#2997ff]/20 uppercase tracking-wider mb-4">
            {category} Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            {title}
          </h1>
          <p className="text-base sm:text-lg text-[#a1a1a6] font-normal leading-relaxed">
            {subtitle}
          </p>
        </div>

        {actionButton && <div className="shrink-0">{actionButton}</div>}
      </div>

      {/* Main Content Stage */}
      <main className="w-full">{children}</main>
    </div>
  );
}

