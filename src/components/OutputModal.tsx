"use client";

import { useWorkflowStore } from "@/store/workflowStore";
import { ROLE_CONFIG } from "@/types";
import { X, Terminal, CornerDownRight } from "lucide-react";
import type { AgentRole } from "@/types";

export default function OutputModal() {
    const { agents, outputModalAgentId, setOutputModalAgentId } = useWorkflowStore();

    const agent = agents.find((a) => a.id === outputModalAgentId);

    if (!outputModalAgentId || !agent) return null;

    const currentRole = agent.role as AgentRole;
    const roleConfig = ROLE_CONFIG[currentRole];

    const getSimulatedLogPayload = () => {
        // 🚀 FIXED: Cast to 'any' safely to bypass the strict type checker if 'objective' isn't explicitly on the Agent type
        const objectiveText = (agent as any).objective || "unspecified task criteria";

        switch (currentRole) {
            case "web-scraper":
                return `[INFO] Initializing headless chromium worker process...\n[SCRAPE] Target localized vectors loaded for: "${objectiveText}"\n[FETCH] Querying indexing points via secure sockets...\n[SUCCESS] Retrieved 14 active catalog records. Extracted item weights, pricing structures, and vendor specs from local indices cleanly. Data frame piped forward.`;
            case "code-reviewer":
                return `[SYSTEM] Spawning abstract syntax tree (AST) validator...\n[ANALYSIS] Parsing inbound payload data relating to "${objectiveText}"\n[LINT] Checking script formatting conventions and edge structural definitions...\n[COMPLETED] 0 structural logic errors detected. Refactored logic loop optimizations applied. Ready for execution pipeline generation.`;
            default:
                return `[SYSTEM] Workspace node activated at ${new Date().toLocaleTimeString()}...\n[PROCESS] Parsing dataset streams for: "${objectiveText}"\n[METRIC] Execution threshold processed efficiently with ${agent.intelligence}% pipeline capacity.\n[SUCCESS] Matrix output sequence synchronized successfully. Ready for target nodes downstream.`;
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
            {/* Premium Multi-Layered Obsidian Glass Panel */}
            <div className="w-full max-w-lg bg-[#07070c]/90 border border-white/[0.06] rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300">

                {/* Upper Window Header Controls */}
                <div className="px-5 py-3.5 bg-[#0b0b14] border-b border-white/[0.04] flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm border shadow-sm transition-all"
                            style={{
                                color: roleConfig?.color || "#4d7cfe",
                                backgroundColor: `${roleConfig?.color || "#4d7cfe"}0a`,
                                borderColor: `${roleConfig?.color || "#4d7cfe"}20`
                            }}
                        >
                            <Terminal size={13} />
                        </div>
                        <div>
                            <h3 className="text-xs font-mono font-semibold text-[#e8e8f0] tracking-tight">
                                {agent.label}
                            </h3>
                            <p className="text-[10px] font-mono text-[#444460] mt-0.5 uppercase tracking-wider">
                                Node Diagnostics
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => setOutputModalAgentId(null)}
                        className="p-1.5 rounded-lg border border-white/5 text-[#555570] hover:text-[#e8e8f0] hover:bg-white/[0.03] transition-all duration-200"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Console Terminal Main Deck */}
                <div className="p-5">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#030306] border-t border-x border-white/[0.04] rounded-t-xl">
                        <div className="flex items-center gap-1.5">
                            <Terminal size={11} className="text-[#444460]" />
                            <span className="text-[10px] text-[#444460] font-mono tracking-wide">bash</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5f56]/40" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffbd2e]/40" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[#27c93f]/40" />
                        </div>
                    </div>

                    <div className="bg-[#030306]/90 border border-white/[0.04] p-4 rounded-b-xl font-mono text-xs leading-relaxed max-h-[280px] overflow-y-auto selection:bg-[#3b82f6]/30 shadow-inner scrollbar-thin">
                        <div className="flex gap-2.5 items-start text-[#e8e8f0]">
                            <CornerDownRight size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
                            <span className="whitespace-pre-wrap tracking-normal text-[#b4b4c6]">
                                {getSimulatedLogPayload()}
                            </span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}