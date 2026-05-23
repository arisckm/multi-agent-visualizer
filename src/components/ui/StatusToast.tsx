"use client";

import { useEffect, useState } from "react";
import { useWorkflowStore } from "@/store/workflowStore";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function StatusToast() {
  const { isRunning, agents } = useWorkflowStore();
  const [visible, setVisible] = useState(false);

  const allCompleted =
    agents.length > 0 && agents.every((a) => a.status === "completed");

  useEffect(() => {
    if (isRunning) {
      setVisible(true);
    } else if (allCompleted) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 4000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [isRunning, allCompleted]);

  if (!visible) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-in pointer-events-none">
      <div
        className={`flex items-center gap-3 px-4 py-2.5 rounded-full border bg-[#07070c]/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.5)] transition-all duration-300 ${allCompleted
            ? "border-[#10b981]/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
            : "border-[#3b82f6]/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
          }`}
      >
        {/* State Icon Indicators */}
        <div className="flex items-center justify-center relative">
          {isRunning ? (
            <Loader2 size={13} className="text-[#3b82f6] animate-spin" />
          ) : (
            <>
              <span className="absolute w-2 h-2 rounded-full bg-[#10b981]/40 animate-ping" />
              <CheckCircle2 size={13} className="text-[#10b981] relative z-10" />
            </>
          )}
        </div>

        {/* Status Messaging */}
        <span
          className={`text-[11px] font-mono tracking-wide ${allCompleted ? "text-[#10b981]" : "text-[#3b82f6]"
            }`}
        >
          {isRunning ? "Pipeline execution active..." : "Pipeline sync successfully complete"}
        </span>
      </div>
    </div>
  );
}