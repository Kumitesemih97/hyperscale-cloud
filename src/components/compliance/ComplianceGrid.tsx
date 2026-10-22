"use client";

import React from "react";
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  CheckCircle, 
  ChevronRight,
  Cpu
} from "lucide-react";

interface ComplianceBadge {
  id: string;
  name: string;
  category: "Security" | "Privacy" | "Government" | "Financial";
  status: "Audited & Certified" | "Continuous Monitoring";
  description: string;
  auditStandard: string;
}

const COMPLIANCE_STANDARDS: ComplianceBadge[] = [
  {
    id: "soc2",
    name: "SOC 1 / 2 / 3 Type II",
    category: "Security",
    status: "Audited & Certified",
    description: "Annual independent third-party audit of Security, Availability, and Confidentiality trust service criteria.",
    auditStandard: "AICPA SSAE 18 / ISAE 3402",
  },
  {
    id: "iso27001",
    name: "ISO/IEC 27001:2022",
    category: "Security",
    status: "Audited & Certified",
    description: "Global gold standard for Information Security Management Systems (ISMS) across all global datacenter facilities.",
    auditStandard: "ANAB Accredited Certification",
  },
  {
    id: "fedramp",
    name: "FedRAMP High Authorized",
    category: "Government",
    status: "Continuous Monitoring",
    description: "Highest baseline standard for US government agency deployments and critical infrastructure workloads.",
    auditStandard: "NIST SP 800-53 Rev. 5 (421 Controls)",
  },
  {
    id: "hipaa",
    name: "HIPAA / HITECH BAA",
    category: "Privacy",
    status: "Audited & Certified",
    description: "Execute Business Associate Agreements (BAA) to store and process protected health information (ePHI) safely.",
    auditStandard: "HHS Security & Privacy Rules",
  },
  {
    id: "pci",
    name: "PCI DSS v4.0 Level 1",
    category: "Financial",
    status: "Audited & Certified",
    description: "Highest tier of payment card industry certification for transaction processing and tokenization vaults.",
    auditStandard: "Qualified Security Assessor (QSA)",
  },
  {
    id: "gdpr",
    name: "GDPR / EU Sovereign Data",
    category: "Privacy",
    status: "Audited & Certified",
    description: "Guaranteed European sovereign data residency with contractual zero US CLOUD Act data transfer guarantees.",
    auditStandard: "Article 28 DPA & SCCs Enforced",
  },
];

const SECURITY_PILLARS = [
  {
    title: "Confidential Computing",
    icon: <Cpu className="w-5 h-5 text-[#2997ff]" />,
    description:
      "Data encrypted in-memory and during execution via AMD SEV-SNP and Intel TDX cryptographically isolated enclaves. Even hypervisor operators cannot inspect memory pages.",
  },
  {
    title: "Dedicated Cloud HSM",
    icon: <Key className="w-5 h-5 text-[#f5f5f7]" />,
    description:
      "FIPS 140-3 Level 4 tamper-resistant dedicated hardware security modules giving enterprise customers exclusive physical control over cryptographic root keys.",
  },
  {
    title: "Zero-Trust Mesh & mTLS",
    icon: <Lock className="w-5 h-5 text-[#30d158]" />,
    description:
      "Every intra-node packet is authenticated using ephemeral SPIFFE identities and encrypted with Post-Quantum Kyber-768 hybrid ciphers.",
  },
];

export function ComplianceGrid() {
  return (
    <section className="py-24 border-b border-white/[0.06] relative" id="compliance">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#a1a1a6]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
            <span>Trust & Compliance</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Enterprise Trust. Verified by Math.
          </h2>
          <p className="text-base sm:text-lg text-[#a1a1a6] leading-relaxed">
            Built to meet the uncompromising security, isolation, and audit requirements of defense,
            tier-1 banking, and frontier healthcare foundation models.
          </p>
        </div>

        {/* 3 Pillars of Security Architecture: Apple Bento Cards */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {SECURITY_PILLARS.map((pillar, idx) => (
            <div
              key={idx}
              className="apple-bento-card p-7 space-y-4 group"
            >
              <div className="p-3 rounded-2xl bg-white/[0.05] w-fit border border-white/10">
                {pillar.icon}
              </div>
              <h3 className="text-[17px] font-semibold text-[#f5f5f7] tracking-tight">{pillar.title}</h3>
              <p className="text-xs text-[#a1a1a6] leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>

        {/* Regulatory Certification Badges Grid */}
        <div className="mt-14 pt-12 border-t border-white/[0.06]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-[#f5f5f7] tracking-tight">Active Regulatory Certifications</h3>
              <p className="text-xs text-[#a1a1a6] mt-1">
                Continuous independent audits and transparent compliance attestation reports.
              </p>
            </div>
            <a
              href="#calculator"
              className="apple-link text-xs font-medium"
            >
              <span>Download SOC 3 & ISO Packages</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COMPLIANCE_STANDARDS.map((badge) => (
              <div
                key={badge.id}
                className="apple-inner-card p-5 flex flex-col justify-between space-y-3 hover:border-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#f5f5f7]">{badge.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[#30d158] border border-white/10 text-[10px] font-medium flex items-center gap-1.5">
                      <CheckCircle className="w-2.5 h-2.5" />
                      <span>{badge.status}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#a1a1a6] mt-2 leading-relaxed">
                    {badge.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] font-mono text-[#a1a1a6]">
                  <span>Standard:</span>
                  <span className="text-[#d1d1d6]">{badge.auditStandard}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
