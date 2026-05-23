import { create } from "zustand";

// 1. Unified Agent Roles aligned with UI Configuration
export type AgentRole =
  | "web-scraper"
  | "summarizer"
  | "code-reviewer"
  | "data-analyst"
  | "content-writer"
  | "decision-maker"
  | "output";

export interface Agent {
  id: string;
  name: string;
  label: string;
  role: AgentRole;
  status: "idle" | "processing" | "completed" | "failed";
  intelligence: number;
  instructions?: string; // Missing field restored
}

interface Edge {
  id: string;
  source: string;
  target: string;
  type?: string;
  data?: {
    isActive?: boolean;
  };
}

interface WorkflowState {
  globalObjective: string;
  agents: Agent[];
  edges: Edge[];
  isRunning: boolean;
  selectedAgentId: string | null;
  outputModalAgentId: string | null;
  setOutputModalAgentId: (id: string | null) => void;

  setGlobalObjective: (objective: string) => void;
  addAgent: () => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  removeAgent: (id: string) => void;
  selectAgent: (id: string | null) => void;
  onConnect: (connection: { source: string; target: string }) => void;
  runWorkflow: () => Promise<void>; // Async pipeline handler
  resetWorkflow: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  globalObjective: "",
  agents: [],
  edges: [],
  isRunning: false,
  selectedAgentId: null,
  outputModalAgentId: null,

  setGlobalObjective: (objective) => set({ globalObjective: objective }),

  addAgent: () =>
    set((state) => {
      const newId = (state.agents.length + 1).toString();
      const newAgent: Agent = {
        id: newId,
        name: `Agent ${newId}`,
        label: `Agent Node ${newId}`,
        role: "web-scraper", // Fallback matching initial array list
        status: "idle",
        intelligence: 75,
        instructions: "",
      };
      return {
        agents: [...state.agents, newAgent],
        selectedAgentId: newId,
      };
    }),

  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((agent) =>
        agent.id === id ? { ...agent, ...updates } : agent
      ),
    })),

  removeAgent: (id) =>
    set((state) => ({
      agents: state.agents.filter((agent) => agent.id !== id),
      edges: state.edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedAgentId: state.selectedAgentId === id ? null : state.selectedAgentId,
    })),

  selectAgent: (id) => set({ selectedAgentId: id }),

  setOutputModalAgentId: (id) => set({ outputModalAgentId: id }),

  onConnect: (connection) =>
    set((state) => {
      const newEdge: Edge = {
        id: `e-${connection.source}-${connection.target}`,
        source: connection.source,
        target: connection.target,
        type: "glowEdge", // Links to your custom GlowEdge visualizer component
        data: { isActive: false },
      };
      return { edges: [...state.edges, newEdge] };
    }),

  runWorkflow: async () => {
    const { agents, globalObjective } = get();
    if (!globalObjective.trim() || agents.length === 0) return;

    set({ isRunning: true });

    // Initialize all nodes to processing placeholder
    set({
      agents: agents.map((a) => ({ ...a, status: "processing" })),
    });

    // Simple top-sort heuristic / sequential timeline loop execution simulation
    // Cycles from raw source nodes down through targets to give a real processing feedback loop
    for (const agent of agents) {
      // Step 1: Processing individual agent node
      set((state) => ({
        agents: state.agents.map((a) =>
          a.id === agent.id ? { ...a, status: "processing" } : a
        ),
      }));

      await new Promise((resolve) => setTimeout(resolve, 1400));

      // Step 2: Set agent node as finished and ignite adjacent passing connections
      set((state) => ({
        agents: state.agents.map((a) =>
          a.id === agent.id ? { ...a, status: "completed" } : a
        ),
        edges: state.edges.map((e) =>
          e.source === agent.id ? { ...e, data: { isActive: true } } : e
        ),
      }));
    }

    set({ isRunning: false });
  },

  resetWorkflow: () =>
    set({
      globalObjective: "",
      agents: [],
      edges: [],
      isRunning: false,
      selectedAgentId: null,
      outputModalAgentId: null,
    }),
}));