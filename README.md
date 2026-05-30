# 🤖 Multi-Agent AI Workflow Visualiser

**Mission Control for your AI team.** Design, connect, and execute multi-agent workflows on a beautiful dark-mode canvas.



---

## ✨ Features

- **Visual Node Canvas** — Drag, drop, and arrange agent nodes on a dark-mode workspace
- **Agent Configuration Panel** — Click any node to open a sleek side panel with role selection, intelligence slider, and custom labels
- **7 Agent Roles** — Web Scraper, Summarizer, Code Reviewer, Data Analyst, Content Writer, Decision Maker, Output
- **Animated Connections** — Drag from node handles to create glowing, animated data-flow edges
- **Workflow Execution** — Hit "Execute Workflow" and watch agents pulse, process, and complete in sequence
- **Output Modal** — Double-click a completed node to view its formatted output
- **Live MiniMap** — Colour-coded overview of your entire workflow
- **Status Toast** — Real-time notifications for workflow state

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone / navigate to the project
cd multi-agent-workflow

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎮 How to Use

### Scene 1 — Add Agents
Click **"Add Agent"** in the header. A node appears on the canvas.

### Scene 2 — Configure Personality
Click any node to open the **right-side panel**. Choose a role, set the intelligence level with the slider, and give it a custom label.

### Scene 3 — Connect Agents
Hover over a node edge to reveal the **circular handles**. Click and drag from a handle to another node to create a glowing data-flow connection.

### Scene 4 — Execute
Hit the green **"Execute Workflow"** button. Watch agents pulse blue while processing, then turn green with a checkmark when done.

### Scene 5 — View Output
**Double-click** any completed node to open the output modal showing the agent's formatted result.

---

## 🏗️ Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 14** | React framework with App Router |
| **Tailwind CSS** | Utility-first styling |
| **@xyflow/react** | Node-based canvas (React Flow v12) |
| **Zustand** | Lightweight global state |
| **Framer Motion** | Animation utilities |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, animations, React Flow overrides
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry page
├── components/
│   ├── nodes/
│   │   └── AgentNode.tsx    # Custom React Flow node
│   ├── panels/
│   │   ├── AgentPanel.tsx   # Right-side config panel
│   │   └── OutputModal.tsx  # Output viewer modal
│   ├── ui/
│   │   ├── Header.tsx       # Top navigation bar
│   │   ├── EmptyState.tsx   # Canvas empty state
│   │   └── StatusToast.tsx  # Workflow status notifications
│   └── WorkflowCanvas.tsx   # Main canvas orchestrator
├── store/
│   └── workflowStore.ts     # Zustand state management
├── types/
│   └── index.ts             # TypeScript types + role config
└── lib/
    └── utils.ts             # Utility functions
```

---

## 🎨 Customisation

### Adding a New Agent Role
Open `src/types/index.ts` and add a new entry to `AgentRole` and `ROLE_CONFIG`:

```typescript
export type AgentRole = ... | "my-new-role";

export const ROLE_CONFIG = {
  "my-new-role": {
    label: "My New Role",
    color: "#ff6b35",
    icon: "🚀",
    description: "Does something amazing",
    sampleOutput: "The output that appears in the modal...",
  },
};
```

### Changing Workflow Execution Behaviour
Edit `src/store/workflowStore.ts` → `runWorkflow()` to customise timing, parallelism, or add real API calls.

---

## 📦 Build for Production

```bash
npm run build
npm start
```

---

## 📄 License

MIT © 2024 — Built with ❤️ using Next.js + React Flow
