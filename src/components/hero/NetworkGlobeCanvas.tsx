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

    // Motion sensitivity
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let isVisible = true;
    let isTabActive = !document.hidden;
    let animationFrameId: number | null = null;
    let rotationY = 0.5;
    let rotationX = 0.25;
    let targetRotationY = rotationY;
    let targetRotationX = rotationX;
    let velocityY = 0;
    let velocityX = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    // Cached layout dimensions to eliminate hot-loop layout thrashing
    let cachedWidth = 540;
    let cachedHeight = 540;
    let cachedLeft = 0;
    let cachedTop = 0;

    const updateCachedRect = () => {
      const rect = canvas.getBoundingClientRect();
      cachedWidth = rect.width;
      cachedHeight = rect.height;
      cachedLeft = rect.left;
      cachedTop = rect.top;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = cachedWidth * dpr;
      canvas.height = cachedHeight * dpr;
      // Deterministic transform reset eliminates scale compounding on resize
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCachedRect();
    window.addEventListener("resize", updateCachedRect, { passive: true });

    // Sphere geometry & Cartesian coordinate pre-computation
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

    const popPoints: Point3D[] = GLOBAL_POPS.map((pop) => ({
      ...projectTo3D(pop.lat, pop.lon),
      pop,
    }));

    // Pointer Events API implementation with pointer capture & touch support
    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      velocityY = 0;
      velocityX = 0;
      canvas.setPointerCapture(e.pointerId);
      setActiveTooltip(null);
    };

    const onPointerMove = (e: PointerEvent) => {
      const mouseCanvasX = e.clientX - cachedLeft;
      const mouseCanvasY = e.clientY - cachedTop;

      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;
        velocityY = deltaX * 0.005;
        velocityX = deltaY * 0.005;
        targetRotationY += velocityY;
        targetRotationX += velocityX;
        targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX));
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;
      } else {
        // Tooltip hit testing on PoPs using cached dimensions
        const cx = cachedWidth / 2;
        const cy = cachedHeight / 2;
        let hovered = null;

        const cosY = Math.cos(rotationY);
        const sinY = Math.sin(rotationY);
        const cosX = Math.cos(rotationX);
        const sinX = Math.sin(rotationX);

        for (const pt of popPoints) {
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

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Fallback for detached pointer
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointercancel", onPointerUp);

    // Render loop with true battery-saving lifecycle halt
    let pulseTick = 0;

    const render = () => {
      // If offscreen or tab inactive, do NOT schedule next frame (0% CPU/GPU burn)
      if (!isVisible || !isTabActive) {
        animationFrameId = null;
        return;
      }

      if (!prefersReducedMotion) {
        if (!isDragging) {
          // Momentum damping on release
          velocityY *= 0.94;
          velocityX *= 0.94;
          targetRotationY += 0.0016 + velocityY;
          targetRotationX += velocityX;
          targetRotationX = Math.max(-1.1, Math.min(1.1, targetRotationX));
        }
      }

      // Smooth lerp damping
      rotationY += (targetRotationY - rotationY) * 0.12;
      rotationX += (targetRotationX - rotationX) * 0.12;
      pulseTick += 0.04;

      const width = cachedWidth;
      const height = cachedHeight;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Studio Photonic Radial Atmosphere Glow
      const atmosphereGlow = ctx.createRadialGradient(cx, cy, sphereRadius * 0.7, cx, cy, sphereRadius * 1.4);
      atmosphereGlow.addColorStop(0, "rgba(41, 151, 255, 0.14)");
      atmosphereGlow.addColorStop(0.5, "rgba(48, 209, 88, 0.05)");
      atmosphereGlow.addColorStop(1, "transparent");
      ctx.fillStyle = atmosphereGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, sphereRadius * 1.4, 0, Math.PI * 2);
      ctx.fill();

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const transform = (p: { x: number; y: number; z: number }) => {
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -ptTransformZ(p.x, p.z, sinY, cosY);
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;
        return {
          x: cx + x1,
          y: cy - y2,
          z: z2,
        };
      };

      function ptTransformZ(px: number, pz: number, sY: number, cY: number) {
        return px * sY - pz * cY;
      }

      // Latitude Grid Rings (Specular Obsidian Struts)
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

      // Subsea Cables (Arc Bezier Geodesics with Photonic Optical Packet Flow)
      for (const cable of SUBSEA_CABLES) {
        const p1 = popPoints.find((p) => p.pop?.code === cable.from);
        const p2 = popPoints.find((p) => p.pop?.code === cable.to);
        if (!p1 || !p2) continue;

        const t1 = transform(p1);
        const t2 = transform(p2);

        if (t1.z > -50 || t2.z > -50) {
          const mid = {
            x: (p1.x + p2.x) * 0.55,
            y: (p1.y + p2.y) * 0.55,
            z: (p1.z + p2.z) * 0.55,
          };
          const midLength = Math.hypot(mid.x, mid.y, mid.z) || 1;
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

          // High-velocity optical packet transmission
          const packetT = (pulseTick * 0.4 + (cable.rttMs % 10) * 0.1) % 1;
          const pktX = (1 - packetT) * (1 - packetT) * t1.x + 2 * (1 - packetT) * packetT * tMid.x + packetT * packetT * t2.x;
          const pktY = (1 - packetT) * (1 - packetT) * t1.y + 2 * (1 - packetT) * packetT * tMid.y + packetT * packetT * t2.y;

          ctx.beginPath();
          ctx.arc(pktX, pktY, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#2997ff";
          ctx.shadowColor = "#2997ff";
          ctx.shadowBlur = 8;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // PoP Nodes with Status Beacon Pulses & Depth Shading
      for (const pt of popPoints) {
        const t = transform(pt);
        if (t.z > -40) {
          const depthFactor = (t.z + 40) / (sphereRadius + 40);
          const baseRadius = pt.pop?.tier === "Hyperscale Core" ? 4.5 : 3.5;

          // Concentric beacon pulse
          const pulse = (pulseTick + (pt.pop?.azCount || 1)) % 2;
          ctx.beginPath();
          ctx.arc(t.x, t.y, baseRadius + pulse * 6, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(48, 209, 88, ${(1 - pulse / 2) * 0.65 * depthFactor})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Core dot
          ctx.beginPath();
          ctx.arc(t.x, t.y, baseRadius, 0, Math.PI * 2);
          ctx.fillStyle = pt.pop?.tier === "Hyperscale Core" ? "#30d158" : "#f5f5f7";
          ctx.fill();

          // Region label with high-contrast text
          if (t.z > 40 && pt.pop) {
            ctx.font = "10px SF Mono, monospace";
            ctx.fillStyle = "rgba(245, 245, 247, 0.9)";
            ctx.fillText(pt.pop.code.toUpperCase(), t.x + 8, t.y + 3);
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Safe rAF starter
    const startRenderLoop = () => {
      if (animationFrameId === null && isVisible && isTabActive) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    // Observer to strictly stop animation loop when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries[0]?.isIntersecting ?? false;
        isVisible = intersecting;
        if (isVisible) {
          startRenderLoop();
        } else if (animationFrameId !== null) {
          cancelAnimationFrame(animationFrameId);
          animationFrameId = null;
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Page visibility listener
    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive) {
        startRenderLoop();
      } else if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    startRenderLoop();

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", updateCachedRect);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      // Explicit buffer reclamation: prevent GPU memory retention across route transitions
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = 0;
      canvas.height = 0;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[540px] mx-auto flex items-center justify-center select-none"
    >
      {/* 3D Canvas element with touch-action: none for uninterrupted gesture controls */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full cursor-grab active:cursor-grabbing rounded-full"
        style={{ width: "100%", height: "100%", touchAction: "none" }}
      />

      {/* Screen Reader Semantic Fallback: Accessible Global PoP Directory */}
      <div className="sr-only">
        <h3>Global Network Points of Presence (PoPs)</h3>
        <table>
          <thead>
            <tr>
              <th>Region Code</th>
              <th>City</th>
              <th>Tier</th>
              <th>Capacity</th>
              <th>Availability Zones</th>
            </tr>
          </thead>
          <tbody>
            {GLOBAL_POPS.map((pop) => (
              <tr key={pop.code}>
                <td>{pop.code.toUpperCase()}</td>
                <td>{pop.name}</td>
                <td>{pop.tier}</td>
                <td>{pop.capacityTbps} Tbps</td>
                <td>{pop.azCount} AZs</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Floating Interactive Tooltip: Apple Pro Frosted Glass */}
      {activeTooltip && (
        <div
          role="tooltip"
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full px-3.5 py-2.5 rounded-2xl bg-[#1c1c1e]/95 border border-white/15 shadow-apple-card backdrop-blur-2xl text-left animate-in fade-in zoom-in-95 duration-100"
          style={{
            left: activeTooltip.x,
            top: activeTooltip.y,
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.15), 0 16px 40px rgba(0, 0, 0, 0.7)",
          }}
        >
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#30d158]" />
            <span className="font-mono text-xs font-semibold text-[#f5f5f7]">
              {activeTooltip.name} ({activeTooltip.code})
            </span>
          </div>
          <div className="text-[11px] text-[#a1a1a6] mt-0.5">{activeTooltip.tier}</div>
          <div className="text-[10px] font-mono text-[#2997ff] mt-1">{activeTooltip.capacity}</div>
        </div>
      )}

      {/* Drag Hint overlay: Apple Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[11px] text-[#a1a1a6] backdrop-blur-md pointer-events-none">
        Interactive 3D Mesh • Drag to Rotate
      </div>
    </div>
  );
}
