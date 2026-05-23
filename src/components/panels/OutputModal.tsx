"use client";

import { useEffect, useCallback } from "react";
import { X, Copy, Check, Download } from "lucide-react";
import { useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { ROLE_CONFIG } from "@/types";

export default function OutputModal() {
  const { agents, outputModalAgentId, closeOutputModal } = useWorkflowStore();
  const [copied, setCopied] = useState(false);

  const agent = agents.find((a) => a.id === outputModalAgentId);

  const handleCopy = useCallback(() => {
    if (!agent) return;
    const roleConfig = ROLE_CONFIG[agent.role];
    navigator.clipboard.writeText(roleConfig.sampleOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [agent]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOutputModal();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeOutputModal]);

  if (!agent || !outputModalAgentId) return null;

  const roleConfig = ROLE_CONFIG[agent.role];

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && closeOutputModal()}
      style={{ background: "rgba(5, 5, 7, 0.85)", backdropFilter: "blur(12px)" }}
    >
      <div
        className="relative w-[640px] max-h-[80vh] rounded-2xl animate-modal-in flex flex-col"
        style={{
          background: "#0a0a0f",
          border: `1px solid ${roleConfig.color}30`,
          boxShadow: `0 0 0 1px ${roleConfig.color}15, 0 32px 80px rgba(0,0,0,0.8)`,
        }}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-8 right-8 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${roleConfig.color}, transparent)` }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a2e] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{
                background: `${roleConfig.color}18`,
                border: `1px solid ${roleConfig.color}30`,
              }}
            >
              {roleConfig.icon}
            </div>
            <div>
              <div
                className="text-[10px] font-mono uppercase tracking-widest"
                style={{ color: `${roleConfig.color}88` }}
              >
                Agent Output
              </div>
              <div className="text-sm font-display font-semibold text-[#e8e8f0]">
                {agent.label}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono border transition-all duration-150"
              style={{
                color: copied ? "#00ff88" : "#888899",
                borderColor: copied ? "#00ff8830" : "#1a1a2e",
                background: copied ? "#00ff8808" : "transparent",
              }}
            >
              {copied ? <Check size={11} /> : <Copy size={11} />}
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={closeOutputModal}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555570] hover:text-[#e8e8f0] hover:bg-[#1a1a2e] transition-all duration-150"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-4 px-6 py-3 border-b border-[#1a1a2e] flex-shrink-0">
          <Stat label="Status" value="Completed" color="#00ff88" />
          <Stat label="Role" value={roleConfig.label} color={roleConfig.color} />
          {agent.processingTime && (
            <Stat label="Duration" value={`${agent.processingTime}ms`} color="#888899" />
          )}
          <Stat
            label="Intelligence"
            value={`${agent.intelligence}%`}
            color={roleConfig.color}
          />
        </div>

        {/* Output content */}
        <div className="flex-1 overflow-y-auto p-6">
          <pre
            className="text-[12px] font-mono text-[#c8c8d8] leading-relaxed whitespace-pre-wrap break-words"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {roleConfig.sampleOutput}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-[#1a1a2e] flex-shrink-0">
          <span className="text-[9px] font-mono text-[#333350]">
            Press ESC to close
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-display font-semibold transition-all duration-150"
            style={{
              background: `${roleConfig.color}18`,
              border: `1px solid ${roleConfig.color}30`,
              color: roleConfig.color,
            }}
          >
            <Download size={11} />
            Export Output
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div>
      <div className="text-[9px] font-mono text-[#444460] uppercase tracking-widest mb-0.5">
        {label}
      </div>
      <div
        className="text-[11px] font-mono font-medium"
        style={{ color }}
      >
        {value}
      </div>
    </div>
  );
}
