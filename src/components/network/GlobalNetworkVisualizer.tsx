"use client";

import React, { useState } from "react";
import { 
  GLOBAL_POPS, 
  SUBSEA_CABLES, 
  calculateLatency, 
  haversineDistance, 
  type PoP 
} from "../../core/network/topology";
import { 
  Radio, 
  ArrowRight, 
  Zap, 
  MapPin,
  ChevronRight
} from "lucide-react";

export function GlobalNetworkVisualizer() {
  const [sourcePoP, setSourcePoP] = useState<PoP>(GLOBAL_POPS[0]); // default IAD (Virginia)
  const [targetPoP, setTargetPoP] = useState<PoP>(GLOBAL_POPS[2]); // default FRA (Frankfurt)

  // Calculate live ping between selected PoPs
  const calculatedPingMs = calculateLatency(sourcePoP, targetPoP);
  const calculatedDistanceKm = haversineDistance(
    sourcePoP.lat,
    sourcePoP.lon,
    targetPoP.lat,
    targetPoP.lon
  );

  // SVG dimensions for equirectangular projection
  const mapWidth = 960;
  const mapHeight = 480;

  // Project (lat, lon) to SVG (x, y) coordinates
  const project = (lat: number, lon: number) => {
    const x = ((lon + 180) / 360) * mapWidth;
    const y = ((90 - lat) / 180) * mapHeight;
    return { x, y };
  };

  return (
    <section className="py-24 border-b border-white/[0.06] relative" id="network">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Apple Keynote Style */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#86868b]">
            <Radio className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>140+ Tbps Global Fabric</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Light-Speed Optical Transit.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
            Wholly owned trans-oceanic subsea cables and anycast border routing deliver deterministic,
            single-digit millisecond latency between any two major financial capitals.
          </p>
        </div>

        {/* Interactive Ping Simulator Toolbar: Apple Pill Bar */}
        <div className="mt-12 p-4 sm:p-5 apple-bento-card flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Source Region Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#86868b]">Origin:</span>
              <select
                value={sourcePoP.code}
                onChange={(e) => {
                  const p = GLOBAL_POPS.find((pop) => pop.code === e.target.value);
                  if (p) setSourcePoP(p);
                }}
                className="bg-white/[0.06] border border-white/10 text-xs font-mono text-[#f5f5f7] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#2997ff]"
                aria-label="Origin Datacenter PoP"
              >
                {GLOBAL_POPS.map((pop) => (
                  <option key={pop.code} value={pop.code} className="bg-[#1c1c1e] text-white">
                    {pop.name} ({pop.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-[#86868b] hidden sm:inline" />

            {/* Target Region Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#86868b]">Destination:</span>
              <select
                value={targetPoP.code}
                onChange={(e) => {
                  const p = GLOBAL_POPS.find((pop) => pop.code === e.target.value);
                  if (p) setTargetPoP(p);
                }}
                className="bg-white/[0.06] border border-white/10 text-xs font-mono text-[#f5f5f7] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#2997ff]"
                aria-label="Destination Datacenter PoP"
              >
                {GLOBAL_POPS.map((pop) => (
                  <option key={pop.code} value={pop.code} className="bg-[#1c1c1e] text-white">
                    {pop.name} ({pop.code.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Telemetry Indicator */}
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <div className="text-[10px] font-mono text-[#86868b] uppercase">Geodesic Distance</div>
              <div className="text-sm font-mono font-medium text-[#f5f5f7] tabular-numbers">
                {calculatedDistanceKm.toLocaleString()} km
              </div>
            </div>
            <div className="text-right pl-5 border-l border-white/[0.08]">
              <div className="text-[10px] font-mono text-[#86868b] uppercase">Optical RTT Latency</div>
              <div className="text-xl font-mono font-semibold text-[#30d158] flex items-center justify-end gap-1.5 tabular-numbers">
                <Zap className="w-4 h-4 fill-[#30d158]" />
                <span>{calculatedPingMs} ms</span>
              </div>
            </div>
          </div>
        </div>

        {/* Global Network Map Canvas / SVG Frame */}
        <div className="mt-6 apple-bento-card p-4 sm:p-6 overflow-hidden relative">
          <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl bg-[#0a0a0c] border border-white/[0.04]">
            <svg
              viewBox={`0 0 ${mapWidth} ${mapHeight}`}
              className="w-full h-full select-none"
              aria-label="Global subsea optical cable routes and edge PoPs map"
            >
              <defs>
                <pattern id="net-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="1" />
                </pattern>
                <linearGradient id="active-route-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2997ff" />
                  <stop offset="100%" stopColor="#30d158" />
                </linearGradient>
              </defs>
              <rect width={mapWidth} height={mapHeight} fill="url(#net-grid)" />

              {/* Equator & Prime Meridian reference lines */}
              <line x1="0" y1={mapHeight / 2} x2={mapWidth} y2={mapHeight / 2} stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />
              <line x1={mapWidth / 2} y1="0" x2={mapWidth / 2} y2={mapHeight} stroke="rgba(255, 255, 255, 0.04)" strokeDasharray="4 4" />

              {/* Draw Subsea Cable Mesh */}
              {SUBSEA_CABLES.map((cable) => {
                const p1 = GLOBAL_POPS.find((p) => p.code === cable.from);
                const p2 = GLOBAL_POPS.find((p) => p.code === cable.to);
                if (!p1 || !p2) return null;

                const c1 = project(p1.lat, p1.lon);
                const c2 = project(p2.lat, p2.lon);

                const midX = (c1.x + c2.x) / 2;
                const midY = (c1.y + c2.y) / 2 - 25;

                const isConnectedToSelected =
                  (sourcePoP.code === cable.from && targetPoP.code === cable.to) ||
                  (sourcePoP.code === cable.to && targetPoP.code === cable.from);

                return (
                  <g key={cable.id}>
                    <path
                      d={`M ${c1.x} ${c1.y} Q ${midX} ${midY} ${c2.x} ${c2.y}`}
                      fill="none"
                      stroke={isConnectedToSelected ? "url(#active-route-grad)" : "rgba(255, 255, 255, 0.12)"}
                      strokeWidth={isConnectedToSelected ? 2.5 : 1}
                      strokeDasharray={isConnectedToSelected ? "none" : "3 3"}
                    />
                  </g>
                );
              })}

              {/* Draw Live Simulated Transit Route between Source & Target */}
              {sourcePoP.code !== targetPoP.code && (() => {
                const c1 = project(sourcePoP.lat, sourcePoP.lon);
                const c2 = project(targetPoP.lat, targetPoP.lon);
                const midX = (c1.x + c2.x) / 2;
                const midY = (c1.y + c2.y) / 2 - 35;
                return (
                  <path
                    d={`M ${c1.x} ${c1.y} Q ${midX} ${midY} ${c2.x} ${c2.y}`}
                    fill="none"
                    stroke="#30d158"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                );
              })()}

              {/* Draw PoPs */}
              {GLOBAL_POPS.map((pop) => {
                const { x, y } = project(pop.lat, pop.lon);
                const isSelected = pop.code === sourcePoP.code || pop.code === targetPoP.code;

                return (
                  <g
                    key={pop.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      if (pop.code !== sourcePoP.code) setTargetPoP(pop);
                    }}
                  >
                    {/* Pulsing ring for selected PoPs */}
                    {isSelected && (
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="none"
                        stroke="#30d158"
                        strokeWidth="1.5"
                        className="animate-ping opacity-75 origin-center"
                      />
                    )}

                    {/* PoP Core Dot */}
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 5.5 : 3.5}
                      fill={isSelected ? "#30d158" : "#f5f5f7"}
                      stroke="#000000"
                      strokeWidth="1.5"
                    />

                    {/* Label */}
                    <text
                      x={x + 8}
                      y={y + 3}
                      fill={isSelected ? "#ffffff" : "#86868b"}
                      fontSize="9"
                      fontFamily="SF Mono, monospace"
                      fontWeight={isSelected ? "bold" : "normal"}
                      className="select-none transition-colors group-hover:fill-white"
                    >
                      {pop.code.toUpperCase()}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
