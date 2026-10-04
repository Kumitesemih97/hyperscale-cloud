export type SandboxState = "idle" | "planning" | "provisioning" | "verifying" | "ready" | "error";

export type IaCTemplate = "terraform" | "pulumi" | "cli";

export type FSMEvent =
  | { type: "SELECT_IAC"; template: IaCTemplate }
  | { type: "DEPLOY" }
  | { type: "TICK" }
  | { type: "RESET" };

export interface Token {
  type: "keyword" | "string" | "property" | "comment" | "punctuation" | "number" | "text";
  value: string;
}

export const IAC_SNIPPETS: Record<IaCTemplate, { filename: string; language: string; code: string }> = {
  terraform: {
    filename: "main.tf",
    language: "hcl",
    code: `terraform {
  required_providers {
    hypercloud = {
      source  = "hypercloud/global"
      version = "~> 4.12.0"
    }
  }
}

# Deploy Distributed Multi-Region GPU AI Cluster
resource "hypercloud_cluster" "inference_mesh" {
  name        = "deep-inference-v4"
  environment = "production"
  tier        = "mission-critical"

  regions = [
    { code = "us-east-1", azs = 3, instances = 64 },
    { code = "eu-central-1", azs = 3, instances = 32 },
    { code = "ap-northeast-1", azs = 3, instances = 32 }
  ]

  compute_spec {
    accelerator_type = "NVIDIA-B200-SXM6"
    gpus_per_node    = 8
    nvlink_fabric    = "3.2Tbps-Quantum-X800"
    confidential_vm  = true
  }

  networking {
    anycast_vip          = true
    ddos_protection      = "layer7-automated"
    subsea_direct_mesh   = true
    max_latency_target_ms = 45
  }
}`,
  },
  pulumi: {
    filename: "index.ts",
    language: "typescript",
    code: `import * as hypercloud from "@hypercloud/sdk";

// Define Global Anycast GPU Mesh Cluster
export const cluster = new hypercloud.compute.DistributedCluster("inference-mesh", {
  tier: "mission-critical",
  redundancy: "active-active-tri-region",
  spec: {
    accelerator: "NVIDIA-B200-SXM6",
    nodesPerRegion: 64,
    interconnect: "Quantum-X800-InfiniBand",
    zeroTrustEncryption: {
      inTransit: "TLS-1.3-ChaCha20",
      atRest: "AES-256-GCM-HSM"
    }
  },
  regions: ["us-east-1", "eu-central-1", "ap-northeast-1"],
  autoscaling: {
    minNodes: 32,
    maxNodes: 512,
    targetGpuUtilization: 0.85
  }
});

export const endpoint = cluster.globalAnycastIpv6;
export const latencySla = cluster.guaranteedP99Latency;`,
  },
  cli: {
    filename: "deploy.sh",
    language: "bash",
    code: `# Initialize Enterprise Identity & Session
hypercloud auth login --org="enterprise-core" --key-ring="corp-hsm-01"

# Provision Multi-Region Distributed AI Fabric
hypercloud cluster deploy \\
  --name "deep-inference-v4" \\
  --regions "us-east-1,eu-central-1,ap-northeast-1" \\
  --accelerator "b200.sxm6.8x" \\
  --mesh-interconnect "3.2tbps-quantum" \\
  --confidential-enclave "enforced" \\
  --health-probe-interval 50ms \\
  --rollout-strategy "zero-downtime-canary" \\
  --output json`,
  },
};

export const SIMULATED_DEPLOY_LOGS: Record<SandboxState, string[]> = {
  idle: [
    `// Ready to deploy infrastructure.`,
    `// Click "Deploy Fleet" to trigger deterministic provision sequence.`,
  ],
  planning: [
    `[PLAN] Validating IaC AST topology schema... OK`,
    `[PLAN] Verifying quota for 128x NVIDIA B200 SXM6 across 3 regions... GRANTED`,
    `[PLAN] Mutual TLS 1.3 mesh graph resolved. Zero-trust keys dispatched to HSM.`,
  ],
  provisioning: [
    `[APPLY] Allocating InfiniBand Quantum-X800 3.2Tbps fabric in us-east-1 (IAD)...`,
    `[APPLY] Spinning up bare-metal nodes in eu-central-1 (FRA) AZ-1, AZ-2, AZ-3...`,
    `[APPLY] Establishing anycast BGP route 2600:1900:4000::/48 across 140Tbps backbone...`,
  ],
  verifying: [
    `[VERIFY] Health probes: IAD (0.7ms) | FRA (0.9ms) | NRT (0.8ms)... PASS (3/3)`,
    `[VERIFY] Subsea cable latency benchmarks: Transatlantic (64ms) | Pacific (96ms)... IN SLA`,
    `[VERIFY] SOC 2 Type II & FedRAMP cryptographic attestations verified.`,
  ],
  ready: [
    `{`,
    `  "status": "HEALTHY_ACTIVE",`,
    `  "cluster_id": "hc-cluster-98f2b4e1",`,
    `  "anycast_endpoint": "https://mesh.global.hypercloud.net/v1",`,
    `  "total_compute": "1,024 NVIDIA B200 Tensor Core GPUs",`,
    `  "bisection_bandwidth": "102.4 Tbps",`,
    `  "global_p99_latency_ms": 38.4,`,
    `  "uptime_sla": "99.999%",`,
    `  "compliance": ["SOC2", "ISO27001", "HIPAA", "FedRAMP-High"]`,
    `}`,
  ],
  error: [`[ERROR] Deployment halted: Quota violation.`],
};

export function createSandboxFSM(initialTemplate: IaCTemplate = "terraform") {
  let state: SandboxState = "idle";
  let template: IaCTemplate = initialTemplate;

  return {
    getState: () => state,
    getTemplate: () => template,
    send: (event: FSMEvent) => {
      switch (event.type) {
        case "SELECT_IAC":
          template = event.template;
          state = "idle";
          break;
        case "DEPLOY":
          if (state === "idle" || state === "ready") {
            state = "planning";
          }
          break;
        case "TICK":
          if (state === "planning") state = "provisioning";
          else if (state === "provisioning") state = "verifying";
          else if (state === "verifying") state = "ready";
          break;
        case "RESET":
          state = "idle";
          break;
      }
      return state;
    },
  };
}

export function tokenizeCode(code: string): Token[] {
  const lines = code.split("\n");
  const tokens: Token[] = [];

  const keywords = new Set([
    "terraform", "required_providers", "source", "version", "resource", "import", "export",
    "const", "new", "true", "false", "hypercloud", "auth", "cluster", "deploy"
  ]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (i > 0) {
      tokens.push({ type: "punctuation", value: "\n" });
    }

    if (line.trim().startsWith("#") || line.trim().startsWith("//")) {
      tokens.push({ type: "comment", value: line });
      continue;
    }

    const regex = /("[^"]*"|[a-zA-Z0-9_-]+|[{}[\],.:=()\\|]|--[a-zA-Z0-9-]+|\s+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(line)) !== null) {
      const val = match[0];
      if (val.startsWith('"') && val.endsWith('"')) {
        tokens.push({ type: "string", value: val });
      } else if (val.startsWith("--")) {
        tokens.push({ type: "property", value: val });
      } else if (keywords.has(val)) {
        tokens.push({ type: "keyword", value: val });
      } else if (/^\d+(\.\d+)?$/.test(val)) {
        tokens.push({ type: "number", value: val });
      } else if (/^[{}[\],.:=()\\|]$/.test(val)) {
        tokens.push({ type: "punctuation", value: val });
      } else {
        tokens.push({ type: "text", value: val });
      }
    }
  }

  return tokens;
}
