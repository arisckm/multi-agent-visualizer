"use client";

import { useCallback, useEffect } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  type NodeTypes,
  type EdgeTypes,
  MarkerType,
  getBezierPath,
  BaseEdge,
  type EdgeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useWorkflowStore } from "@/store/workflowStore";
import AgentNode from "@/components/nodes/AgentNode";
import AgentPanel from "@/components/panels/AgentPanel";
import OutputModal from "@/components/OutputModal";
import Header from "@/components/ui/Header";
import EmptyState from "@/components/ui/EmptyState";
import StatusToast from "@/components/ui/StatusToast";
import AnimatedGrid from "@/components/AnimatedGrid";
import { ROLE_CONFIG } from "@/types";
import type { AgentRole } from "@/types";

// ─── Node Types ──────────────────────────────────────────────────────────────
const nodeTypes: NodeTypes = {
  agentNode: (props) => {
    // Read individual role config styles for precise hover accent colors
    const currentRole = props.data?.role as AgentRole;
    const rc = ROLE_CONFIG[currentRole];

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          useWorkflowStore.getState().selectAgent(props.id);
        }}
        // 🚀 DOUBLE-CLICK HANDLER: Opens output logs when execution completes
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (props.data?.status === "completed") {
            useWorkflowStore.getState().setOutputModalAgentId(props.id);
          }
        }}
        // 🚀 MOUSE HOVER EVENTS: Injecting dynamic node accent glows
        onMouseEnter={(e) => {
          const card = e.currentTarget.firstElementChild as HTMLElement;
          if (card) {
            card.style.borderColor = `${rc?.color || "#4d7cfe"}30`;
            card.style.boxShadow = `0 0 25px -5px ${rc?.color || "#4d7cfe"}15, inset 0 1px 0 0 rgba(255,255,255,0.03)`;
          }
        }}
        onMouseLeave={(e) => {
          const card = e.currentTarget.firstElementChild as HTMLElement;
          if (card) {
            card.style.borderColor = "rgba(255, 255, 255, 0.05)";
            card.style.boxShadow = "none";
          }
        }}
        className="cursor-pointer transition-all duration-300 rounded-2xl"
      >
        <AgentNode {...props} />
      </div>
    );
  },
};

// ─── Custom Edge ─────────────────────────────────────────────────────────────
function GlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, selected, data }: EdgeProps) {
  const [edgePath] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
  const isActive = (data as { isActive?: boolean })?.isActive;

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: isActive ? "#00d4ff" : selected ? "#4d7cfe" : "#2a2a4a",
        strokeWidth: isActive ? 2.5 : 2,
      }}
    />
  );
}

const edgeTypes: EdgeTypes = { glowEdge: GlowEdge };

// ─── Main Canvas ─────────────────────────────────────────────────────────────
export default function WorkflowCanvas() {
  const { agents, edges, onConnect, selectedAgentId, selectAgent, outputModalAgentId } = useWorkflowStore();
  const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);

  useEffect(() => {
    setNodes((prev) =>
      agents.map((agent, i) => {
        const existing = prev.find((n) => n.id === agent.id);
        return {
          id: agent.id,
          type: "agentNode",
          position: existing?.position ?? { x: 120 + (i % 4) * 260, y: 180 + Math.floor(i / 4) * 180 },
          data: { ...agent },
        };
      })
    );
  }, [agents, setNodes]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#050507]">
      {/* 1. Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <AnimatedGrid />
      </div>

      {/* 2. UI Header */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Header />
      </div>

      {/* 3. React Flow Layer */}
      <div className="absolute inset-0 w-full h-full z-10 pt-16">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onConnect={onConnect}
          onPaneClick={() => selectAgent(null)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent w-full h-full"
        >
          <Background variant={BackgroundVariant.Dots} gap={40} size={1} color="rgba(26, 26, 46, 0.35)" />

          {/* FIXED: Dark Styled Controls */}
          <Controls className="!bottom-6 !left-6 !top-auto !bg-[#09090d] !border !border-white/10 !rounded-lg text-white [&_button]:!bg-transparent [&_button]:!border-white/5 [&_svg]:!fill-white" />

          {/* FIXED: Dark Styled MiniMap */}
          <MiniMap
            className="!bottom-6 !right-6 !top-auto !bg-[#09090d] !border !border-white/10 !rounded-xl overflow-hidden"
            maskColor="rgba(0, 0, 0, 0.6)"
            nodeColor="#2a2a4a"
            bgColor="#050507"
          />
        </ReactFlow>
      </div>

      {/* 4. Empty State Layer */}
      {agents.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto pt-16">
          <EmptyState />
        </div>
      )}

      {/* 5. Overlay Panel Layer */}
      {selectedAgentId && (
        <div className="absolute top-0 right-0 h-full w-[340px] z-[100]">
          <AgentPanel />
        </div>
      )}

      {outputModalAgentId && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center">
          <OutputModal />
        </div>
      )}

      <div className="absolute bottom-6 left-24 z-[100]">
        <StatusToast />
      </div>
    </div>
  );
}