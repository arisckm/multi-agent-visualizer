import WorkflowCanvas from "@/components/WorkflowCanvas";
import OutputModal from "@/components/OutputModal";

export default function Home() {
  return (
    <main className="w-screen h-screen overflow-hidden bg-[#050507] relative">
      {/* Your main workspace (now housing the animated mesh inside it) */}
      <WorkflowCanvas />

      {/* 
          The Modal is "portal-like". 
          It stays hidden until useWorkflowStore's outputModalAgentId is set.
      */}
      <OutputModal />
    </main>
  );
}