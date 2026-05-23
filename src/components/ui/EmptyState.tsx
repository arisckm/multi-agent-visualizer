"use client";

import React from "react";
import { Plus, Cpu, GitBranch, Zap, MousePointerClick } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export default function EmptyState() {
  const { addAgent } = useWorkflowStore();

  return (
    // FIX: Changed absolute inset-0 to start below the header (top-16) to center the card perfectly in the remaining viewport
    <div className="absolute top-16 bottom-0 left-0 right-0 flex items-center justify-center pointer-events-none select-none">
      <div className="flex flex-col items-center gap-7 animate-fade-in max-w-sm px-6 py-10 rounded-2xl border border-[#1a1a2e]/40 bg-[#07070c]/40 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.6)]">

        {/* Modern Vector Icon Cluster */}
        <div className="relative w-20 h-20 pointer-events-auto">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#4d7cfe]/10 to-[#3b82f6]/5 border border-[#4d7cfe]/20 flex items-center justify-center shadow-[0_0_25px_rgba(77,124,254,0.05)] transition-all duration-300 hover:border-[#4d7cfe]/40">
            <Cpu size={28} className="text-[#4d7cfe]" strokeWidth={1.5} />
          </div>
          {/* Subtle Orbiting Tech Indicator Nodes */}
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#050508] border border-[#1a1a2e] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
          </div>
          <div className="absolute -bottom-1 -left-1 w-4 h-4 rounded-full bg-[#050508] border border-[#1a1a2e] flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00d4ff] animate-pulse" style={{ animationDelay: "0.5s" }} />
          </div>
          <div className="absolute top-1/2 -right-2 w-3 h-3 rounded-full bg-[#050508] border border-[#1a1a2e] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
        </div>

        {/* Clean Typographic Hierarchy */}
        <div className="text-center">
          <h2 className="text-xl font-display font-semibold text-[#e8e8f0] tracking-tight mb-2">
            Initialize Workspace
          </h2>
          <p className="text-xs font-body text-[#555570] max-w-[280px] leading-relaxed mx-auto">
            Construct your multi-agent architecture. Connect operational nodes to deploy automated data pipelines.
          </p>
        </div>

        {/* Pipeline Guide Steps */}
        <div className="flex items-center gap-3 py-1">
          <Step icon={<Plus size={11} />} label="Add Node" color="#4d7cfe" />
          <div className="w-6 h-px bg-[#1a1a2e]" />
          <Step icon={<GitBranch size={11} />} label="Connect" color="#8b5cf6" />
          <div className="w-6 h-px bg-[#1a1a2e]" />
          <Step icon={<Zap size={11} />} label="Execute" color="#10b981" />
        </div>

        {/* Premium Production-Grade Action Trigger Button */}
        <button
          onClick={() => addAgent()}
          className="pointer-events-auto relative group overflow-hidden w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#4d7cfe] to-[#3b82f6] text-white text-xs font-mono font-semibold tracking-wider uppercase shadow-[0_4px_20px_rgba(77,124,254,0.15)] hover:shadow-[0_4px_25px_rgba(77,124,254,0.25)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <Plus size={13} strokeWidth={2.5} className="transition-transform duration-200 group-hover:rotate-90" />
          Initialize First Node
        </button>

        {/* Minimal System Notice */}
        <p className="flex items-center gap-1.5 text-[10px] font-mono text-[#333350]">
          <MousePointerClick size={10} className="text-[#333350]" />
          Tip: Drag between node anchors to build pipeline paths
        </p>
      </div>
    </div>
  );
}

function Step({
  icon,
  label,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200"
        style={{
          background: `${color}0c`,
          border: `1px solid ${color}20`,
          color
        }}
      >
        {icon}
      </div>
      <div className="text-[8px] font-mono text-[#444460] uppercase tracking-widest font-medium">
        {label}
      </div>
    </div>
  );
}