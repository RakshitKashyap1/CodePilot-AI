"use client";

import React from "react";
import { Folder, FileCode, ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
  language?: string;
}

const MOCK_FILES: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      { id: "2", name: "app.ts", type: "file", language: "typescript" },
      { id: "3", name: "utils.ts", type: "file", language: "typescript" },
      {
        id: "4",
        name: "components",
        type: "folder",
        children: [
          { id: "5", name: "Button.tsx", type: "file", language: "typescript" },
        ],
      },
    ],
  },
  { id: "6", name: "package.json", type: "file", language: "json" },
];

export function FileExplorer({
  activeFileId,
  onFileSelect,
}: {
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
}) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({ "1": true });

  const toggleFolder = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderNode = (node: FileNode, depth = 0) => {
    const isFolder = node.type === "folder";
    const isExpanded = expanded[node.id];
    const isActive = activeFileId === node.id;

    return (
      <div key={node.id}>
        <div
          className={cn(
            "flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-accent/50 rounded-sm text-sm transition-colors",
            isActive && "bg-primary/10 text-primary",
            depth > 0 && "ml-4"
          )}
          onClick={() => (isFolder ? toggleFolder(node.id) : onFileSelect(node.id))}
        >
          {isFolder ? (
            isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          ) : (
            <FileCode className="h-4 w-4 text-blue-400" />
          )}
          {isFolder && <Folder className="h-4 w-4 text-yellow-500 fill-yellow-500/20" />}
          <span className="truncate">{node.name}</span>
        </div>
        {isFolder && isExpanded && node.children?.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="w-full space-y-1 py-2">
      <div className="px-4 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
        Files
      </div>
      <div className="px-2">
        {MOCK_FILES.map((node) => renderNode(node))}
      </div>
    </div>
  );
}
