"use client";

import { useWorkflowStore } from "@/store/workflowStore";
import { Play, Plus, Cpu, GitBranch, Zap, Target } from "lucide-react";

export default function Header() {
  const {
    agents,
    isRunning,
    addAgent,
    runWorkflow,
    globalObjective,
    setGlobalObjective,
  } = useWorkflowStore();

  const processingCount = agents.filter((a) => a.status === "processing").length;

  return (
    <header
      className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3 gap-6"
      style={{
        background: "rgba(10, 10, 15, 0.92)",
        borderBottom: "1px solid #1a1a2e",
        backdropFilter: "blur(24px)",
      }}
    >
      {/* Logo Group */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative w-8 h-8 rounded-lg bg-[#4d7cfe10] border border-[#4d7cfe20] flex items-center justify-center">
          <Cpu size={14} className="text-[#4d7cfe]" />
        </div>
        <div>
          <div className="text-[10px] font-mono text-[#555570] tracking-wider">MISSION CONTROL</div>
          <div className="text-sm font-bold text-[#e8e8f0]">Multi-Agent Workflow Visualiser</div>
        </div>
      </div>

      {/* 🚀 COMMAND MODULE: Explicit Instructional Prompt */}
      <div className="flex-1 max-w-lg flex items-center justify-center">
        <div className="flex items-center w-full h-10 px-4 gap-3 bg-[#111116] border border-[#2a2a3e] rounded-full shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <Target size={14} className="text-[#4d7cfe] shrink-0" />
          <input
            type="text"
            disabled={isRunning}
            value={globalObjective}
            onChange={(e) => setGlobalObjective(e.target.value)}
            placeholder="Enter your global objective here to begin workflow analysis..."
            className="w-full bg-transparent text-[13px] font-mono text-[#e8e8f0] focus:outline-none placeholder-[#666688]"
          />
          <div
            className="w-2 h-2 rounded-full transition-colors duration-300"
            style={{
              backgroundColor: isRunning ? "#00d4ff" : "#00ff88",
              boxShadow: isRunning ? "0 0 8px #00d4ff" : "0 0 8px #00ff88"
            }}
          />
        </div>
      </div>

      {/* Metrics & Actions Group */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-4 text-[11px] font-mono text-[#555570]">
          <span className="flex items-center gap-1.5">
            <GitBranch size={12} /> AGENTS {agents.length}
          </span>
          <span className="flex items-center gap-1.5">
            <Zap size={12} /> ACTIVE {processingCount}
          </span>
        </div>

        <div className="h-6 w-px bg-[#1a1a2e]" />

        <div className="flex items-center gap-2">
          <button
            onClick={addAgent}
            className="px-3 py-1.5 rounded-lg bg-[#1a1a2e] text-[12px] font-bold text-[#e8e8f0] hover:bg-[#252538] transition-colors"
          >
            + Add Agent
          </button>
          <button
            onClick={() => runWorkflow()}
            disabled={isRunning || agents.length === 0 || !globalObjective.trim()}
            className="px-3 py-1.5 rounded-lg bg-[#00ff88]/10 border border-[#00ff88]/20 text-[12px] font-bold text-[#00ff88] hover:bg-[#00ff88]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isRunning ? "Running..." : "▶ Execute"}
          </button>
        </div>
      </div>
    </header>
  );
}