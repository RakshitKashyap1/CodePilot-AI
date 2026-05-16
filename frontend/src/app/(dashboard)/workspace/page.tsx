"use client";

import React from "react";
import dynamic from "next/dynamic";

const FileExplorer = dynamic(() => import("@/features/workspace/components/file-explorer").then(mod => mod.FileExplorer), {
  ssr: false,
  loading: () => <div className="w-64 h-full bg-card/30 animate-pulse" />,
});

const CodeEditor = dynamic(() => import("@/features/workspace/components/code-editor").then(mod => mod.CodeEditor), {
  ssr: false,
  loading: () => <div className="flex-1 bg-[#1e1e1e] animate-pulse" />,
});

const AIReviewPanel = dynamic(() => import("@/features/workspace/components/ai-review-panel").then(mod => mod.AIReviewPanel), {
  ssr: false,
  loading: () => <div className="w-80 h-full bg-card/50 animate-pulse" />,
});

export default function WorkspacePage() {
  const [activeFileId, setActiveFileId] = React.useState("2");

  return (
    <div className="flex h-[calc(100vh-64px-48px)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      {/* Sidebar: File Explorer */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card/30">
        <FileExplorer activeFileId={activeFileId} onFileSelect={setActiveFileId} />
      </div>

      {/* Main Content: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <CodeEditor activeFileId={activeFileId} />
      </div>

      {/* Right Sidebar: AI Review */}
      <div className="w-80 flex-shrink-0">
        <AIReviewPanel />
      </div>
    </div>
  );
}
