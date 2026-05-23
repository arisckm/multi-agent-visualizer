import React from "react";
import {
  Bot,
  FileText,
  ShieldAlert,
  BarChart3,
  PenTool,
  GitFork,
  CheckCircle2
} from "lucide-react";

export type AgentRole =
  | "web-scraper"
  | "summarizer"
  | "code-reviewer"
  | "data-analyst"
  | "content-writer"
  | "decision-maker"
  | "output";

export type AgentStatus = "idle" | "processing" | "completed" | "error";

export interface AgentData {
  id: string;
  label: string;
  role: AgentRole;
  intelligence: number; // 1–100 (Maps to 0.0 - 1.0 temperature in UI)
  status: AgentStatus;
  description?: string;
  output?: string;
  processingTime?: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  animated?: boolean;
}

export const ROLE_CONFIG: Record<
  AgentRole,
  {
    label: string;
    color: string;
    icon: React.ReactNode;
    description: string;
    sampleOutput: string;
  }
> = {
  "web-scraper": {
    label: "Web Scraper",
    color: "#00d4ff",
    icon: React.createElement(Bot, { size: 16 }),
    description: "Automated engine to crawl and extract structured content from target endpoints.",
    sampleOutput:
      "Scraped 147 records from target URLs.\n\nExtracted fields:\n- Title: ✓\n- Author: ✓\n- Timestamp: ✓\n- Content: ✓\n- Tags: ✓\n\nData written to pipeline buffer. Ready for downstream processing.",
  },
  "summarizer": {
    label: "Summarizer",
    color: "#8b5cf6",
    icon: React.createElement(FileText, { size: 16 }),
    description: "Condenses large text structures and multi-source contexts into clean intelligence.",
    sampleOutput:
      "## Executive Summary\n\nAnalyzed 147 records across 12 categories. Key findings:\n\n1. **Primary Theme**: 73% of content relates to AI productivity tooling\n2. **Sentiment**: Predominantly positive (82% positive, 11% neutral, 7% negative)\n3. **Trending Topics**: Workflow automation, multi-agent systems, LLM orchestration\n\nRecommendation: Prioritize content strategy around agentic AI use-cases.",
  },
  "code-reviewer": {
    label: "Code Reviewer",
    color: "#00ff88",
    icon: React.createElement(ShieldAlert, { size: 16 }),
    description: "Evaluates syntax architecture, code optimization quality, and safety vulnerabilities.",
    sampleOutput:
      "```typescript\n// ✅ REVIEW COMPLETE — 3 issues found\n\n// 🔴 CRITICAL: SQL injection vulnerability (line 42)\nconst query = `SELECT * FROM users WHERE id = ${userId}`;\n// Fix: Use parameterized queries\n\n// 🟡 WARNING: Missing null check (line 78)\nconst name = user.profile.name; // profile may be undefined\n\n// 🟢 SUGGESTION: Extract magic number (line 104)\nif (retries > 3) { ... } // → const MAX_RETRIES = 3\n```",
  },
  "data-analyst": {
    label: "Data Analyst",
    color: "#4d7cfe",
    icon: React.createElement(BarChart3, { size: 16 }),
    description: "Processes statistical computational calculations and isolates structural data patterns.",
    sampleOutput:
      "## Statistical Report\n\nDataset: 2,840 observations | 18 features\n\n**Correlations (top 3):**\n- engagement ↔ session_length: r = 0.87\n- conversion ↔ page_depth: r = 0.74\n- churn ↔ support_tickets: r = 0.69\n\n**Anomalies detected:** 12 outliers removed (Grubbs test, α=0.05)\n\n**Model accuracy:** 94.2% (Random Forest, 10-fold CV)",
  },
  "content-writer": {
    label: "Content Writer",
    color: "#ff6b35",
    icon: React.createElement(PenTool, { size: 16 }),
    description: "Generates production-ready technical copy, document updates, and clear documentation.",
    sampleOutput:
      "# The Future of Work Is Agentic\n\nAs AI systems grow more capable, the question shifts from *can machines think?* to *can machines collaborate?* Multi-agent workflows represent the next frontier—autonomous systems that divide, conquer, and synthesize complex tasks with minimal human oversight.\n\nThe implications for knowledge work are profound...",
  },
  "decision-maker": {
    label: "Decision Maker",
    color: "#ff3b5c",
    icon: React.createElement(GitFork, { size: 16 }),
    description: "Evaluates multi-path logical assertions and optimizes pipeline operational execution routing.",
    sampleOutput:
      "## Decision Matrix\n\nEvaluated 4 pathways against 6 criteria:\n\n| Option | Feasibility | ROI | Risk | Score |\n|--------|------------|-----|------|-------|\n| Path A | 9/10 | 8/10 | 3/10 | 83% |\n| Path B | 7/10 | 9/10 | 5/10 | 78% |\n| Path C | 6/10 | 6/10 | 2/10 | 71% |\n\n**→ ROUTING TO: Path A** (highest composite score)",
  },
  "output": {
    label: "Output Handler",
    color: "#00ff88",
    icon: React.createElement(CheckCircle2, { size: 16 }),
    description: "Final data aggregation wrapper and distribution gateway delivery node.",
    sampleOutput:
      "## ✅ Workflow Complete\n\nAll 5 agents executed successfully in 12.4 seconds.\n\n**Pipeline Summary:**\n- Web Scraper → 147 records collected\n- Data Analyst → Patterns identified\n- Summarizer → Key insights extracted\n- Content Writer → Report generated\n- Decision Maker → Recommended action logged\n\n**Deliverable ready for export.**",
  },
};