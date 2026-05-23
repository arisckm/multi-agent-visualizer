"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  Thermometer,
  Tag,
  ChevronRight,
  Cpu,
  Terminal,
} from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";
import { ROLE_CONFIG } from "@/types";
import type { AgentRole } from "@/types";
import { cn } from "@/lib/utils";

const roles: AgentRole[] = [
  "web-scraper",
  "summarizer",
  "code-reviewer",
  "data-analyst",
  "content-writer",
  "decision-maker",
  "output",
];

interface IconProps {
  baseColor: string;
  isSelected: boolean;
}

// Bespoke, semantically multi-colored terminal icons that adapt beautifully to their active state
const ROLE_ICONS: Record<AgentRole, (props: IconProps) => React.ReactNode> = {
  "web-scraper": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" stroke={baseColor} strokeOpacity={isSelected ? 0.35 : 0.2} />
      <path d="M12 2v20M2 12h20" stroke={baseColor} strokeOpacity={isSelected ? 0.25 : 0.15} strokeDasharray="3 3" />
      <path d="M12 6a6 6 0 0 1 6 6M6 12a6 6 0 0 1 6-6" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2.5" />
      <circle cx="12" cy="12" r="2.5" fill={baseColor} stroke="none" />
    </svg>
  ),
  "summarizer": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 6h16M4 18h16" stroke={baseColor} strokeOpacity={isSelected ? 0.4 : 0.25} />
      <path d="M8 12h8" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2.5" />
      <rect x="4" y="10" width="3" height="4" rx="0.5" fill={baseColor} stroke="none" />
      <circle cx="19" cy="12" r="2" fill={isSelected ? "#ffffff" : baseColor} stroke="none" />
    </svg>
  ),
  "code-reviewer": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 6L1 12l5 6M18 18l5-6-5-6" stroke={baseColor} strokeWidth="2.2" strokeOpacity={isSelected ? 1 : 0.6} />
      <line x1="10" y1="16" x2="15" y2="16" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2.5" />
    </svg>
  ),
  "data-analyst": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="13" width="3" height="8" rx="0.5" fill={baseColor} stroke="none" opacity={isSelected ? 0.9 : 0.5} />
      <rect x="10" y="8" width="3" height="13" rx="0.5" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2" />
      <rect x="17" y="4" width="3" height="17" rx="0.5" fill={baseColor} stroke="none" opacity={isSelected ? 0.4 : 0.2} />
      <path d="M3 10l6-4 5 3.5 7-5.5" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  "content-writer": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1" stroke={baseColor} strokeOpacity={isSelected ? 0.25 : 0.15} strokeDasharray="2 2" />
      <path d="M12 7h5M7 12h10M7 17h6" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2" />
    </svg>
  ),
  "decision-maker": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 6.5v6c0 5.25 4 10.12 9 11 5-.88 9-5.75 9-11v-6L12 2z" stroke={baseColor} strokeOpacity={isSelected ? 0.35 : 0.2} />
      <circle cx="12" cy="9" r="2.5" fill={isSelected ? "#ffffff" : baseColor} stroke="none" />
      <path d="M12 12v5m-3 3h6" stroke={baseColor} strokeWidth="2" strokeOpacity={isSelected ? 1 : 0.6} />
    </svg>
  ),
  "output": ({ baseColor, isSelected }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="12" rx="1.5" stroke={baseColor} strokeWidth="2" strokeOpacity={isSelected ? 1 : 0.5} />
      <path d="M6 8h8M6 12h4" stroke={isSelected ? "#ffffff" : baseColor} strokeWidth="2" />
      <circle cx="17" cy="12" r="1.5" fill={baseColor} stroke="none" opacity={isSelected ? 1 : 0.4} />
    </svg>
  ),
};

function getTempZone(val: number) {
  if (val <= 25) return { label: "Deterministic", color: "#3b82f6" };
  if (val <= 55) return { label: "Balanced", color: "#10b981" };
  if (val <= 80) return { label: "Creative", color: "#f59e0b" };
  return { label: "Chaotic", color: "#ef4444" };
}

export default function AgentPanel() {
  const { agents, selectedAgentId, selectAgent, updateAgent, removeAgent } =
    useWorkflowStore();

  const agent = agents.find((a) => a.id === selectedAgentId);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") selectAgent(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectAgent]);

  if (!agent) return null;

  const currentRole = agent.role as AgentRole;
  const roleConfig = ROLE_CONFIG[currentRole];
  const displayTemperature = (agent.intelligence / 100).toFixed(2);
  const tempZone = getTempZone(agent.intelligence);

  return (
    <AnimatePresence>
      {agent && (
        <motion.div
          ref={panelRef}
          initial={{ x: 360, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 360, opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 280, mass: 0.8 }}
          className="absolute top-0 right-0 h-full w-[360px] z-40 flex flex-col bg-[#07070a]/95 backdrop-blur-md shadow-[-16px_0_48px_rgba(0,0,0,0.6)]"
          style={{
            borderLeft: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300"
                style={{
                  background: `${roleConfig?.color || "#4d7cfe"}0c`,
                  borderColor: `${roleConfig?.color || "#4d7cfe"}20`,
                  boxShadow: `0 0 12px -2px ${roleConfig?.color || "#4d7cfe"}20`,
                }}
              >
                {ROLE_ICONS[currentRole]({
                  baseColor: roleConfig?.color || "#4d7cfe",
                  isSelected: true,
                })}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono text-[#3e3e56] uppercase tracking-[0.12em] leading-none mb-1.5">
                  Agent Config
                </p>
                <p className="text-[13px] font-bold text-[#e2e2f0] truncate leading-none tracking-tight">
                  {agent.label}
                </p>
              </div>
            </div>

            <button
              onClick={() => selectAgent(null)}
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-white/5 text-[#44445c] hover:text-[#e2e2f0] hover:bg-white/[0.03] transition-all duration-200"
            >
              <X size={13} strokeWidth={2} />
            </button>
          </div>

          <div className="mx-5 h-px bg-white/[0.03]" />

          {/* ── Scrollable Body Deck ── */}
          <div className="flex-1 overflow-y-auto pl-5 pr-3.5 py-5 space-y-6 scrollbar-thin">

            {/* Label field */}
            <section className="pr-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#44445c] uppercase tracking-[0.12em] mb-2.5">
                <Tag size={9} strokeWidth={2.5} />
                Label
              </label>
              <input
                type="text"
                value={agent.label}
                onChange={(e) => updateAgent(agent.id, { label: e.target.value })}
                className="w-full px-3 py-2 rounded-xl text-[13px] font-medium outline-none bg-white/[0.02] border border-white/[0.05] text-[#e2e2f0] transition-all duration-300 placeholder:text-[#2a2a3a]"
                onFocus={e => {
                  e.currentTarget.style.borderColor = `${roleConfig?.color || "#4d7cfe"}40`;
                  e.currentTarget.style.boxShadow = `0 0 16px -4px ${roleConfig?.color || "#4d7cfe"}20`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.boxShadow = "none";
                }}
                placeholder="Agent name…"
              />
            </section>

            {/* Persona Selection Cards */}
            <section>
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#44445c] uppercase tracking-[0.12em] mb-2.5">
                <Cpu size={9} strokeWidth={2.5} />
                Persona Selector
              </label>
              <div className="space-y-1.5 max-h-[290px] overflow-y-auto pr-1.5 scrollbar-thin">
                {roles.map((role) => {
                  const rc = ROLE_CONFIG[role];
                  const isSelected = currentRole === role;
                  const activeColor = rc?.color || "#4d7cfe";

                  return (
                    <button
                      key={role}
                      onClick={() => updateAgent(agent.id, { role })}
                      className={cn(
                        "group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left border transition-all duration-300 overflow-hidden",
                        isSelected
                          ? "bg-[#0b0b14] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]"
                          : "bg-transparent border-white/[0.03] hover:border-white/[0.08] hover:bg-white/[0.01]"
                      )}
                      style={{
                        borderColor: isSelected ? `${activeColor}30` : undefined,
                        boxShadow: isSelected ? `inset 0 0 12px -2px ${activeColor}10, 0 8px 24px -12px ${activeColor}20` : undefined
                      }}
                    >
                      {/* Reactive micro-glow accent sidebar line inside selected card */}
                      <div
                        className={cn("absolute left-0 top-2 bottom-2 w-[2px] rounded-r-full opacity-0 transition-opacity duration-300", isSelected && "opacity-100")}
                        style={{ backgroundColor: activeColor }}
                      />

                      {/* Modular Icon Frame Container */}
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-300 group-hover:scale-105"
                        style={{
                          background: isSelected ? `${activeColor}12` : `${activeColor}04`,
                          borderColor: isSelected ? `${activeColor}25` : `${activeColor}10`,
                          boxShadow: isSelected ? `0 0 8px ${activeColor}20` : undefined
                        }}
                      >
                        {ROLE_ICONS[role]({
                          baseColor: activeColor,
                          isSelected: isSelected
                        })}
                      </div>

                      {/* Detailed Meta Strings */}
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[11px] font-bold leading-none mb-1 transition-colors duration-200"
                          style={{ color: isSelected ? "#ffffff" : "#8a8a9e" }}
                        >
                          {rc?.label}
                        </p>
                        <p className="text-[9px] text-[#44445c] font-mono leading-tight truncate group-hover:text-[#5a5a75] transition-colors">
                          {rc?.description}
                        </p>
                      </div>

                      {/* Multi-state selection micro dot indicator */}
                      <div className="shrink-0 flex items-center justify-center w-4 h-4">
                        {isSelected ? (
                          <div
                            className="w-1 h-1 rounded-full animate-pulse"
                            style={{
                              backgroundColor: activeColor,
                              boxShadow: `0 0 8px 1px ${activeColor}`
                            }}
                          />
                        ) : (
                          <ChevronRight
                            size={11}
                            strokeWidth={2.5}
                            className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-[#44445c]"
                          />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Temperature control */}
            <section className="pr-1.5">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#44445c] uppercase tracking-[0.12em]">
                  <Thermometer size={9} strokeWidth={2.5} />
                  Temperature
                </label>

                <div className="flex items-baseline gap-1.5">
                  <span
                    className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors duration-300"
                    style={{
                      color: tempZone.color,
                      background: `${tempZone.color}0d`,
                      border: `1px solid ${tempZone.color}15`,
                    }}
                  >
                    {tempZone.label}
                  </span>
                  <span
                    className="text-[14px] font-mono font-bold tabular-nums transition-colors duration-300"
                    style={{ color: tempZone.color }}
                  >
                    {displayTemperature}
                  </span>
                </div>
              </div>

              <div className="relative pt-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={agent.intelligence}
                  onChange={(e) =>
                    updateAgent(agent.id, { intelligence: Number(e.target.value) })
                  }
                  className="w-full h-1 rounded-full appearance-none outline-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${tempZone.color} ${agent.intelligence}%, rgba(255,255,255,0.04) ${agent.intelligence}%)`,
                    accentColor: tempZone.color,
                  }}
                />
              </div>

              <div className="flex justify-between mt-2.5 px-0.5">
                <span className="text-[8px] font-mono text-[#262636]">0.0 · Strict</span>
                <span className="text-[8px] font-mono text-[#262636]">0.5 · Balanced</span>
                <span className="text-[8px] font-mono text-[#262636]">1.0 · Creative</span>
              </div>
            </section>

            {/* System Instructions Section */}
            <section className="pr-1.5">
              <label className="flex items-center gap-1.5 text-[10px] font-mono text-[#44445c] uppercase tracking-[0.12em] mb-2.5">
                <Terminal size={9} strokeWidth={2.5} />
                System Instructions
              </label>
              <textarea
                value={agent.instructions || ""}
                onChange={(e) => updateAgent(agent.id, { instructions: e.target.value })}
                placeholder="Define specific constraints, rules, or guidelines for this persona..."
                className="w-full h-24 min-h-[80px] px-3 py-2 rounded-xl text-[12px] font-normal leading-relaxed outline-none bg-white/[0.02] border border-white/[0.05] text-[#e2e2f0] transition-all duration-300 placeholder:text-[#232330] resize-none scrollbar-thin"
                onFocus={e => {
                  e.currentTarget.style.borderColor = `${roleConfig?.color || "#4d7cfe"}40`;
                  e.currentTarget.style.boxShadow = `0 0 16px -4px ${roleConfig?.color || "#4d7cfe"}20`;
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </section>

            <div className="h-px bg-white/[0.03] mr-1.5" />

            {/* Danger Zone */}
            <section className="pr-1.5">
              <p className="text-[10px] font-mono text-[#44445c] uppercase tracking-[0.12em] mb-2.5">
                Danger Zone
              </p>
              <button
                onClick={() => {
                  removeAgent(agent.id);
                  selectAgent(null);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-semibold border transition-all duration-300 bg-red-500/[0.02] border-red-500/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-300"
              >
                <Trash2 size={12} strokeWidth={2} />
                Terminate Node Ecosystem
              </button>
            </section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}