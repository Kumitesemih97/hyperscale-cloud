# AETHER CLOUD // Enterprise Hyperscale Platform

A production-grade, highly performant enterprise landing page and interactive infrastructure console for an AWS/GCP/Azure-class hyperscale cloud provider.

Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and pure TypeScript domain modeling.

---

## ⚡ Architectural Highlights

1. **Brand Identity & Design System**:
   - Dark-mode first (`#09090b` canvas with WCAG AAA 7:1 contrast ratio).
   - Radial glow gradients, glassmorphism cards (`backdrop-blur-md`), and minimalist borders (`border-white/10`).
   - Accessible range sliders with high-contrast indicator tracks.

2. **Hero & 60fps Network Topology Canvas**:
   - Native HTML5 Canvas 3D orthographic projection without heavy Three.js runtime bloat.
   - Interactive mouse orbit controls with inertial damping.
   - Real-time geodesic subsea cable arcs and pulsing datacenter PoP beacons.
   - **Performance Guard**: `IntersectionObserver` automatically disconnects the animation loop when scrolled offscreen.
   - **A11y Guard**: Respects `prefers-reduced-motion` and low concurrency hardware.

3. **Core Infrastructure Matrix**:
   - Tabbed architecture matrix covering **Compute** (NVIDIA B200 SXM6 / AMD EPYC 9654 / Serverless microVMs), **Storage & DB** (NVMe-oF, ExaScale Object, Spanner-class SQL), **AI/ML Foundation** (Quantum-X800 InfiniBand clusters, low-latency inference endpoints), and **Global Networking**.

4. **Live Interactive IaC Sandbox / Code Terminal**:
   - Side-by-side view: IaC code tabs (**Terraform `main.tf`**, **Pulumi `index.ts`**, **Cloud CLI `deploy.sh`**) with AST tokenized safe syntax highlighting.
   - Deterministic Finite State Machine (`idle` -> `planning` -> `provisioning` -> `verifying` -> `ready`) simulating live deployment telemetry and JSON endpoint outputs.

5. **Enterprise Compliance & Trust Center**:
   - Regulatory certifications: **SOC 1/2/3 Type II**, **ISO/IEC 27001**, **FedRAMP High**, **HIPAA**, **PCI DSS v4.0**, and **GDPR EU Data Sovereignty**.
   - Architectural security pillars: AMD SEV-SNP confidential VMs, dedicated Cloud HSM (FIPS 140-3), and zero-trust mutual TLS 1.3 mesh.

6. **Interactive TCO / Cost Estimator**:
   - Dynamic sliders for vCPU, GPU compute units, NVMe storage, and egress bandwidth.
   - Pure integer-cents arithmetic engine comparing real-time expenditures against AWS, GCP, and Azure.

7. **Global Network Visualizer & Ping Simulator**:
   - Interactive subsea cable routes and datacenter PoPs.
   - Real-time geodesic Haversine distance and fiber transit latency calculation between any two global regions.

8. **Sticky Navbar & Command Palette**:
   - Global `Cmd+K` / `Ctrl+K` searchable command palette with keyboard navigation.
   - Region selector with real-time latency ping telemetry.

---

## 🛠️ Quickstart

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Test Suite
```bash
npx tsx --test src/core/__tests__/core.test.ts
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm run start
```
