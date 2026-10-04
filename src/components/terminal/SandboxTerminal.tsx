"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  IAC_SNIPPETS, 
  createSandboxFSM, 
  tokenizeCode, 
  type IaCTemplate, 
  type SandboxState, 
  SIMULATED_DEPLOY_LOGS 
} from "../../core/sandbox/fsm";
import { 
  Terminal, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  CheckCircle2, 
  ChevronRight
} from "lucide-react";

export function SandboxTerminal() {
  const [selectedTemplate, setSelectedTemplate] = useState<IaCTemplate>("terraform");
  const [fsmState, setFsmState] = useState<SandboxState>("idle");
  const [terminalLines, setTerminalLines] = useState<string[]>(SIMULATED_DEPLOY_LOGS.idle);
  const [isCopied, setIsCopied] = useState(false);
  const fsmRef = useRef(createSandboxFSM(selectedTemplate));

  const currentSnippet = IAC_SNIPPETS[selectedTemplate];
  const tokens = tokenizeCode(currentSnippet.code);

  const handleSelectTemplate = (template: IaCTemplate) => {
    setSelectedTemplate(template);
    fsmRef.current.send({ type: "SELECT_IAC", template });
    setFsmState("idle");
    setTerminalLines(SIMULATED_DEPLOY_LOGS.idle);
  };

  const handleDeploy = () => {
    if (fsmState === "planning" || fsmState === "provisioning" || fsmState === "verifying") return;

    fsmRef.current.send({ type: "DEPLOY" });
    setFsmState("planning");
    setTerminalLines(SIMULATED_DEPLOY_LOGS.planning);

    setTimeout(() => {
      fsmRef.current.send({ type: "TICK" });
      setFsmState("provisioning");
      setTerminalLines((prev) => [...prev, ...SIMULATED_DEPLOY_LOGS.provisioning]);
    }, 700);

    setTimeout(() => {
      fsmRef.current.send({ type: "TICK" });
      setFsmState("verifying");
      setTerminalLines((prev) => [...prev, ...SIMULATED_DEPLOY_LOGS.verifying]);
    }, 1500);

    setTimeout(() => {
      fsmRef.current.send({ type: "TICK" });
      setFsmState("ready");
      setTerminalLines((prev) => [...prev, ...SIMULATED_DEPLOY_LOGS.ready]);
    }, 2300);
  };

  const handleReset = () => {
    fsmRef.current.send({ type: "RESET" });
    setFsmState("idle");
    setTerminalLines(SIMULATED_DEPLOY_LOGS.idle);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <section className="py-24 border-b border-white/[0.06] relative" id="terminal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header: Apple Keynote Style */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-[12px] font-medium text-[#86868b]">
            <Terminal className="w-3.5 h-3.5 text-[#2997ff]" />
            <span>Declarative Control</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-[#f5f5f7]">
            Deploy in Seconds via Code.
          </h2>
          <p className="text-base sm:text-lg text-[#86868b] leading-relaxed">
            Define multi-region AI superclusters, low-latency anycast routes, and zero-trust encryption
            with standard Terraform, Pulumi, or the Aether CLI.
          </p>
        </div>

        {/* Split View Container: macOS Window Styling */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Code Editor Pane */}
          <div className="lg:col-span-7 flex flex-col rounded-2xl bg-[#121215] border border-white/10 overflow-hidden shadow-apple-card">
            {/* macOS Window Chrome */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#161618]">
              {/* Traffic Lights & Template Tabs */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/50 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/50 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/50 inline-block" />
                </div>

                <div className="apple-segmented-track !p-1">
                  <button
                    onClick={() => handleSelectTemplate("terraform")}
                    className={`apple-segmented-item !py-1 !px-3 !text-[11px] font-mono ${
                      selectedTemplate === "terraform" ? "active" : ""
                    }`}
                  >
                    main.tf
                  </button>
                  <button
                    onClick={() => handleSelectTemplate("pulumi")}
                    className={`apple-segmented-item !py-1 !px-3 !text-[11px] font-mono ${
                      selectedTemplate === "pulumi" ? "active" : ""
                    }`}
                  >
                    index.ts
                  </button>
                  <button
                    onClick={() => handleSelectTemplate("cli")}
                    className={`apple-segmented-item !py-1 !px-3 !text-[11px] font-mono ${
                      selectedTemplate === "cli" ? "active" : ""
                    }`}
                  >
                    deploy.sh
                  </button>
                </div>
              </div>

              {/* Copy Code Button */}
              <button
                onClick={handleCopy}
                className="apple-btn-secondary !px-2.5 !py-1 !text-[11px] font-mono"
                aria-label="Copy IaC code snippet"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#30d158] mr-1" />
                    <span className="text-[#30d158]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1 text-[#86868b]" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Code Body with Apple Xcode Syntax Highlighting */}
            <div className="p-5 sm:p-6 overflow-x-auto text-[12px] font-mono leading-relaxed bg-[#0a0a0c] flex-1 max-h-[460px]">
              <div className="flex">
                {/* Line numbers */}
                <div className="select-none pr-4 text-[#48484a] text-right space-y-0.5 border-r border-white/[0.06] mr-4 shrink-0">
                  {currentSnippet.code.split("\n").map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>

                {/* Tokenized safe syntax */}
                <pre className="text-[#f5f5f7] whitespace-pre">
                  {tokens.map((token, index) => {
                    let colorClass = "text-[#f5f5f7]";
                    if (token.type === "keyword") colorClass = "text-[#ff7ab2] font-semibold"; // Xcode pink
                    else if (token.type === "string") colorClass = "text-[#fc6a5d]"; // Xcode red
                    else if (token.type === "property") colorClass = "text-[#5dd8ff]"; // Xcode cyan
                    else if (token.type === "comment") colorClass = "text-[#6c7986] italic"; // Xcode comment
                    else if (token.type === "number") colorClass = "text-[#d0bf69]"; // Xcode gold
                    else if (token.type === "punctuation") colorClass = "text-[#86868b]";

                    return (
                      <span key={index} className={colorClass}>
                        {token.value}
                      </span>
                    );
                  })}
                </pre>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Terminal */}
          <div className="lg:col-span-5 flex flex-col rounded-2xl bg-[#121215] border border-white/10 overflow-hidden shadow-apple-card">
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-[#161618]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#30d158] inline-block" />
                <span className="text-[12px] font-mono text-[#a1a1a6] pl-1">
                  telemetry.mesh // live
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center space-x-2 font-mono text-[11px]">
                {fsmState === "ready" ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ONLINE</span>
                  </span>
                ) : fsmState === "idle" ? (
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[#86868b] border border-white/10">STANDBY</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30 animate-pulse">
                    {fsmState.toUpperCase()}...
                  </span>
                )}
              </div>
            </div>

            {/* Terminal Logs Output */}
            <div
              role="log"
              aria-live="polite"
              className="p-4 sm:p-5 flex-1 bg-[#0a0a0c] font-mono text-[12px] overflow-y-auto space-y-1.5 max-h-[400px] text-[#f5f5f7] select-text"
            >
              {terminalLines.map((line, idx) => {
                let textStyle = "text-[#a1a1a6]";
                if (line.startsWith("[PLAN]")) textStyle = "text-[#2997ff]";
                else if (line.startsWith("[APPLY]")) textStyle = "text-[#ffd60a]";
                else if (line.startsWith("[VERIFY]")) textStyle = "text-[#ff9f0a]";
                else if (line.includes("HEALTHY_ACTIVE")) textStyle = "text-[#30d158] font-semibold";
                else if (line.startsWith("//")) textStyle = "text-[#6c7986]";

                return (
                  <div key={idx} className={`${textStyle} transition-opacity`}>
                    {line}
                  </div>
                );
              })}
            </div>

            {/* Terminal Control Actions Bar */}
            <div className="p-3 border-t border-white/[0.08] bg-[#161618] flex items-center justify-between">
              <button
                onClick={handleReset}
                className="apple-btn-secondary !px-3 !py-1.5 !text-[11px] font-mono"
                aria-label="Reset terminal output"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleDeploy}
                disabled={fsmState === "planning" || fsmState === "provisioning" || fsmState === "verifying"}
                className="apple-btn-blue !px-4 !py-1.5 !text-[12px] disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-white mr-1.5" />
                <span>
                  {fsmState === "idle" || fsmState === "ready"
                    ? "Deploy Fleet"
                    : "Deploying..."}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
