"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function NetworkError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[TELEMETRY_NETWORK_CRASH]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-[22px] bg-[#0d0d10] border border-[#ff453a]/30 shadow-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-[#ff453a]/10 border border-[#ff453a]/20 flex items-center justify-center mx-auto mb-5 text-[#ff453a]">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Network Visualizer Pipeline Disrupted</h2>
        <p className="text-xs font-mono text-[#86868b] mb-6">
          Digest: {error.digest || "ERR_NETWORK_PARTITION_ISOLATED"}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-medium transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset State
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-[#f5f5f7] text-xs font-medium transition-colors border border-white/[0.1]"
          >
            <Home className="w-3.5 h-3.5" />
            Control Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

