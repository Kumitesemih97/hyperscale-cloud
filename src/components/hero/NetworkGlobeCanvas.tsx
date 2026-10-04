"use client";

import React, { useEffect, useRef, useState } from "react";
import { GLOBAL_POPS, SUBSEA_CABLES } from "../../core/network/topology";

interface Point3D {
  x: number;
  y: number;
  z: number;
  pop?: (typeof GLOBAL_POPS)[0];
}

export function NetworkGlobeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<{
    name: string;
    code: string;
    tier: string;
    capacity: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isVisible = true;
    let animationFrameId: number;
    let rotationY = 0.5;
    let rotationX = 0.25;
    let targetRotationY = rotationY;
    let targetRotationX = rotationX;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // Pause render loop when scrolled offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0]?.isIntersecting ?? false;
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Convert lat/lon to 3D Cartesian coordinates on sphere
    const sphereRadius = 180;
    const projectTo3D = (lat: number, lon: number, radius = sphereRadius): Point3D => {
      const phi = ((90 - lat) * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;
      return {
        x: -radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(phi) * Math.sin(theta),
      };
    };

    // Precalculate PoP 3D coordinates
    const popPoints: Point3D[] = GLOBAL_POPS.map((pop) => ({
      ...projectTo3D(pop.lat, pop.lon),
      pop,
    }));

    // Mouse drag handlers
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseCanvasX = e.clientX - rect.left;
      const mouseCanvasY = e.clientY - rect.top;

      if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.006;
        targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX));
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        setActiveTooltip(null);
      } else {
        // Tooltip hit testing on PoPs
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        let hovered = null;

        for (const pt of popPoints) {
          // Rotate point
          const cosY = Math.cos(rotationY);
          const sinY = Math.sin(rotationY);
          const cosX = Math.cos(rotationX);
          const sinX = Math.sin(rotationX);

          const x1 = pt.x * cosY + pt.z * sinY;
          const z1 = -pt.x * sinY + pt.z * cosY;
          const y2 = pt.y * cosX - z1 * sinX;
          const z2 = pt.y * sinX + z1 * cosX;

          if (z2 > 0) {
            const screenX = cx + x1;
            const screenY = cy - y2;
            const dist = Math.hypot(screenX - mouseCanvasX, screenY - mouseCanvasY);
            if (dist < 14 && pt.pop) {
              hovered = {
                name: pt.pop.name,
                code: pt.pop.code.toUpperCase(),
                tier: pt.pop.tier,
                capacity: `${pt.pop.capacityTbps} Tbps Fabric`,
                x: screenX,
                y: screenY - 20,
              };
              break;
            }
          }
        }
        setActiveTooltip(hovered);
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Render loop
    let pulseTick = 0;
    const render = () => {
      if (isVisible) {
        if (!prefersReducedMotion && !isDragging) {
          targetRotationY += 0.0018;
        }

        // Smooth damping
        rotationY += (targetRotationY - rotationY) * 0.1;
        rotationX += (targetRotationX - rotationX) * 0.1;
        pulseTick += 0.04;

        const rect = canvas.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const cx = width / 2;
        const cy = height / 2;

        ctx.clearRect(0, 0, width, height);

        // Radial backdrop glow
        const glow = ctx.createRadialGradient(cx, cy, 50, cx, cy, sphereRadius * 1.35);
        glow.addColorStop(0, "rgba(99, 102, 241, 0.12)");
        glow.addColorStop(0.6, "rgba(56, 189, 248, 0.04)");
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(cx, cy, sphereRadius * 1.35, 0, Math.PI * 2);
        ctx.fill();

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        const transform = (p: { x: number; y: number; z: number }) => {
          const x1 = p.x * cosY + p.z * sinY;
          const z1 = -p.x * sinY + p.z * cosY;
          const y2 = p.y * cosX - z1 * sinX;
          const z2 = p.y * sinX + z1 * cosX;
          return {
            x: cx + x1,
            y: cy - y2,
            z: z2,
          };
        };

        // Draw Latitude Rings
        ctx.lineWidth = 1;
        for (let lat = -60; lat <= 60; lat += 30) {
          const phi = ((90 - lat) * Math.PI) / 180;
          const ringR = sphereRadius * Math.sin(phi);
          const ringY = sphereRadius * Math.cos(phi);

          ctx.beginPath();
          let started = false;
          for (let deg = 0; deg <= 360; deg += 10) {
            const rad = (deg * Math.PI) / 180;
            const px = ringR * Math.cos(rad);
            const pz = ringR * Math.sin(rad);
            const t = transform({ x: px, y: ringY, z: pz });
            if (t.z > -sphereRadius * 0.4) {
              const alpha = Math.max(0.04, ((t.z + sphereRadius * 0.4) / (sphereRadius * 1.4)) * 0.16);
              ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
              if (!started) {
                ctx.moveTo(t.x, t.y);
                started = true;
              } else {
                ctx.lineTo(t.x, t.y);
              }
            } else {
              started = false;
            }
          }
          ctx.stroke();
        }

        // Draw Subsea Cables (Arc Bezier Geodesics)
        for (const cable of SUBSEA_CABLES) {
          const p1 = popPoints.find((p) => p.pop?.code === cable.from);
          const p2 = popPoints.find((p) => p.pop?.code === cable.to);
          if (!p1 || !p2) continue;

          const t1 = transform(p1);
          const t2 = transform(p2);

          // Draw if either point is visible
          if (t1.z > -50 || t2.z > -50) {
            // Midpoint elevated for 3D curved arc
            const mid = {
              x: (p1.x + p2.x) * 0.55,
              y: (p1.y + p2.y) * 0.55,
              z: (p1.z + p2.z) * 0.55,
            };
            const midLength = Math.hypot(mid.x, mid.y, mid.z);
            const elevation = sphereRadius * 1.18;
            const raisedMid = {
              x: (mid.x / midLength) * elevation,
              y: (mid.y / midLength) * elevation,
              z: (mid.z / midLength) * elevation,
            };
            const tMid = transform(raisedMid);

            // Cable curve
            ctx.beginPath();
            ctx.moveTo(t1.x, t1.y);
            ctx.quadraticCurveTo(tMid.x, tMid.y, t2.x, t2.y);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
            ctx.lineWidth = 1;
            ctx.stroke();

            // Animated light packet along cable
            const packetT = (pulseTick * 0.35 + (cable.rttMs % 10) * 0.1) % 1;
            const pktX = (1 - packetT) * (1 - packetT) * t1.x + 2 * (1 - packetT) * packetT * tMid.x + packetT * packetT * t2.x;
            const pktY = (1 - packetT) * (1 - packetT) * t1.y + 2 * (1 - packetT) * packetT * tMid.y + packetT * packetT * t2.y;

            ctx.beginPath();
            ctx.arc(pktX, pktY, 2, 0, Math.PI * 2);
            ctx.fillStyle = "#2997ff";
            ctx.shadowColor = "#2997ff";
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }

        // Draw PoP Nodes with Pulse Rings
        for (const pt of popPoints) {
          const t = transform(pt);
          if (t.z > -40) {
            const depthFactor = (t.z + 40) / (sphereRadius + 40);
            const baseRadius = pt.pop?.tier === "Hyperscale Core" ? 4 : 3;

            // Concentric beacon pulse
            const pulse = (pulseTick + (pt.pop?.azCount || 1)) % 2;
            ctx.beginPath();
            ctx.arc(t.x, t.y, baseRadius + pulse * 6, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(48, 209, 88, ${(1 - pulse / 2) * 0.6 * depthFactor})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Core dot
            ctx.beginPath();
            ctx.arc(t.x, t.y, baseRadius, 0, Math.PI * 2);
            ctx.fillStyle = pt.pop?.tier === "Hyperscale Core" ? "#30d158" : "#f5f5f7";
            ctx.fill();

            // Region label
            if (t.z > 40 && pt.pop) {
              ctx.font = "10px SF Mono, monospace";
              ctx.fillStyle = "rgba(245, 245, 247, 0.85)";
              ctx.fillText(pt.pop.code.toUpperCase(), t.x + 8, t.y + 3);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center select-none"
    >
      {/* 3D Canvas element */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-full"
        style={{ width: "100%", height: "100%" }}
        aria-label="Interactive 3D Global Network Topology visualization"
      />

      {/* Floating Interactive Tooltip: Apple Pro Frosted Glass */}
      {activeTooltip && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full px-3.5 py-2.5 rounded-2xl bg-[#1c1c1e]/95 border border-white/15 shadow-apple-card backdrop-blur-2xl text-left animate-in fade-in zoom-in-95 duration-100"
          style={{ left: activeTooltip.x, top: activeTooltip.y, boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 16px 40px rgba(0, 0, 0, 0.7)" }}
        >
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span className="font-mono text-xs font-semibold text-[#f5f5f7]">
              {activeTooltip.name} ({activeTooltip.code})
            </span>
          </div>
          <div className="text-[11px] text-[#86868b] mt-0.5">{activeTooltip.tier}</div>
          <div className="text-[10px] font-mono text-[#2997ff] mt-1">{activeTooltip.capacity}</div>
        </div>
      )}

      {/* Drag Hint overlay: Apple Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-[#86868b] backdrop-blur-md pointer-events-none">
        Interactive 3D Mesh • Drag to Rotate
      </div>
    </div>
  );
}
