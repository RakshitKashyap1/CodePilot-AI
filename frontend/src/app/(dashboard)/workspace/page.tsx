"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

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
  const [activeFileId, setActiveFileId] = React.useState<string | null>(null);
  const [files, setFiles] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    import("@/services/reviews").then(({ getReviews }) => {
      getReviews().then((data) => {
        const items = Array.isArray(data) ? data : [];
        setFiles(items.map((r: any) => ({ id: r.id, name: r.title, type: "file", language: r.language })));
        if (items.length > 0) setActiveFileId(items[0].id);
      }).catch(() => {}).finally(() => setLoading(false));
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px-48px)] overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      {/* Sidebar: File Explorer */}
      <div className="w-64 flex-shrink-0 border-r border-border bg-card/30">
        <FileExplorer activeFileId={activeFileId ?? ""} onFileSelect={setActiveFileId} files={files} />
      </div>

      {/* Main Content: Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        <CodeEditor activeFileId={activeFileId ?? ""} />
      </div>

      {/* Right Sidebar: AI Review */}
      <div className="w-80 flex-shrink-0">
        <AIReviewPanel reviewId={activeFileId} />
      </div>
    </div>
  );
}
