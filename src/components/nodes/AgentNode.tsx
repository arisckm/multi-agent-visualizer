"use client";

import { memo, useCallback } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useWorkflowStore } from "@/store/workflowStore";
import { ROLE_CONFIG } from "@/types";
import type { AgentData, AgentRole } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_ICONS: Record<string, React.ReactNode> = {
  "web-scraper": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  "summarizer": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  "code-reviewer": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  "data-analyst": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  "content-writer": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  "decision-maker": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  "output": (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

const STATUS_CONFIG = {
  idle: { color: "#3d3d52", label: "Idle" },
  processing: { color: "#3b82f6", label: "Running" },
  completed: { color: "#10b981", label: "Done" },
  error: { color: "#ef4444", label: "Error" },
};

function StatusDot({ status }: { status: AgentData["status"] }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  return (
    <span className="inline-flex items-center gap-1.5">
      {/* Dynamic multiple drop-shadow pulses for running node state indicators */}
      <span className="relative flex h-1.5 w-1.5">
        {status === "processing" && (
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: cfg.color }}
          />
        )}
        <span
          className="relative inline-flex rounded-full h-1.5 w-1.5 transition-colors duration-300"
          style={{ backgroundColor: cfg.color }}
        />
      </span>
      <span className="text-[9px] font-mono uppercase tracking-[0.1em] transition-colors duration-300" style={{ color: cfg.color }}>
        {cfg.label}
      </span>
    </span>
  );
}

function ProgressTrack({ value, color, status }: { value: number; color: string; status: AgentData["status"] }) {
  return (
    <div className="w-full h-[3px] rounded-full overflow-hidden bg-white/[0.03] p-[0.5px]">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_currentColor]",
          status === "processing" && "animate-pulse"
        )}
        style={{ width: `${value}%`, backgroundColor: color, color: color }}
      />
    </div>
  );
}

function AgentNode({ data, selected }: NodeProps) {
  const agentData = data as unknown as AgentData;
  const { selectAgent } = useWorkflowStore();

  const currentRole = (agentData?.role || "web-scraper") as AgentRole;
  const roleConfig = ROLE_CONFIG[currentRole] || {
    color: "#4d7cfe",
    label: "Web Scraper",
    description: "Automated browser parsing node.",
  };

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    selectAgent(agentData.id);
  }, [agentData.id, selectAgent]);

  const progress =
    agentData.status === "completed"
      ? 100
      : agentData.status === "idle"
        ? 0
        : agentData.intelligence ?? 0;

  // Compute glowing color configurations natively matching the custom agent configurations
  const nodeColorAccent = roleConfig.color;
  const isRunning = agentData.status === "processing";

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative w-[210px] rounded-xl cursor-pointer select-none border bg-[#09090d]/95 backdrop-blur-md transition-all duration-300 ease-out",
        selected
          ? "border-transparent shadow-[0_0_25px_-5px_rgba(0,0,0,0.8)]"
          : "border-white/[0.06] hover:border-transparent shadow-[0_4px_24px_rgba(0,0,0,0.4)]"
      )}
      style={{
        // High-fidelity multi-tiered reactive box shadow layer mapping inside code template
        boxShadow: selected
          ? `0 0 0 1px ${nodeColorAccent}40, 0 0 24px -4px ${nodeColorAccent}25, 0 12px 32px -8px rgba(0,0,0,0.7)`
          : undefined,
      }}
    >
      {/* 🚀 PREMIUM GLOW OVERLAY LAYERS */}
      {/* Top accent wire bar */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full transition-all duration-300 opacity-30 group-hover:opacity-100 group-hover:left-3 group-hover:right-3"
        style={{ background: `linear-gradient(90deg, transparent, ${nodeColorAccent}, transparent)` }}
      />

      {/* Interactive background glow map reacting on hover gesture variables */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100 mix-blend-screen",
          isRunning && "opacity-40"
        )}
        style={{
          background: `radial-gradient(100px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${nodeColorAccent}0f, transparent 80%)`,
          boxShadow: isRunning ? `inset 0 0 12px -2px ${nodeColorAccent}15` : `inset 0 0 15px 0 ${nodeColorAccent}0a`
        }}
      />

      {/* 🚀 REACT FLOW INTERACTIVE CANVAS HANDLES */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !rounded-full !transition-all !duration-300 !border-white/20 group-hover:!border-white/50 group-hover:!scale-110 shadow-sm"
        style={{ left: -5, background: "#06060a" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !rounded-full !transition-all !duration-300 !border-white/20 group-hover:!border-white/50 group-hover:!scale-110 shadow-sm"
        style={{ right: -5, background: "#06060a" }}
      />

      {/* Inner Node Grid Context Container */}
      <div className="p-3.5 pt-4">
        <div className="flex items-start gap-2.5 mb-3.5">
          {/* Dynamic Floating Action Icon Module */}
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 group-hover:scale-105"
            style={{
              background: `${nodeColorAccent}0d`,
              border: `1px solid ${nodeColorAccent}20`,
              color: nodeColorAccent,
              boxShadow: isRunning ? `0 0 8px ${nodeColorAccent}30` : undefined
            }}
          >
            {ROLE_ICONS[currentRole] || ROLE_ICONS["web-scraper"]}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono text-[#44445c] uppercase tracking-[0.1em] leading-none mb-1 transition-colors group-hover:text-[#5c5c7a]">
              {roleConfig.label}
            </p>
            <p className="text-[12px] font-semibold text-[#d4d4e8] leading-tight truncate transition-colors group-hover:text-white">
              {agentData.label}
            </p>
          </div>
        </div>

        {/* Dynamic Metric Tracks */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[8px] font-mono text-[#32324a] uppercase tracking-wider">Progress</span>
            <span className="text-[9px] font-mono font-bold transition-all duration-300" style={{ color: nodeColorAccent }}>
              {progress}%
            </span>
          </div>
          <ProgressTrack value={progress} color={nodeColorAccent} status={agentData.status} />
        </div>

        {/* Lower Diagnostic Toolbelt Bar */}
        <div className="flex items-center justify-between pt-1 border-t border-white/[0.02]">
          <StatusDot status={agentData.status} />
          {agentData.status === "completed" && agentData.processingTime ? (
            <span className="text-[8px] font-mono text-[#44445c] bg-white/[0.02] px-1.5 py-0.5 rounded border border-white/[0.04]">{agentData.processingTime}ms</span>
          ) : agentData.status === "completed" ? (
            <span className="text-[8px] font-mono text-[#44445c] opacity-60 group-hover:opacity-100 group-hover:text-white/40 transition-all duration-200 uppercase tracking-wide">dbl-click</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default memo(AgentNode);