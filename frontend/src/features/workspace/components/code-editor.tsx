"use client";

import React from "react";
import Editor from "@monaco-editor/react";
import { X, Save, Play, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileTab {
  id: string;
  name: string;
  content: string;
  language: string;
}

const MOCK_FILES: FileTab[] = [
  {
    id: "2",
    name: "app.ts",
    language: "typescript",
    content: `// CodePilot AI - Automated Review Example
function processUserData(user: any) {
  const result = [];
  user.forEach((u: any) => {
    // AI Suggestion: Consider using .map() for immutability
    result.push(u.name);
  });
  return result;
}

const db_query = "SELECT * FROM users WHERE id = " + user_id; // Security: SQL Injection Risk
`,
  },
  {
    id: "3",
    name: "utils.ts",
    language: "typescript",
    content: `export const formatDate = (date: Date) => {
  return date.toLocaleDateString();
};`,
  },
];

export function CodeEditor({ activeFileId }: { activeFileId: string }) {
  const activeFile = MOCK_FILES.find((f) => f.id === activeFileId) || MOCK_FILES[0];

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Tabs Bar */}
      <div className="flex items-center bg-[#252526] h-9 overflow-x-auto no-scrollbar">
        {MOCK_FILES.map((file) => (
          <div
            key={file.id}
            className={`flex items-center gap-2 px-4 h-full cursor-pointer text-xs transition-colors border-r border-[#1e1e1e] ${
              activeFileId === file.id ? "bg-[#1e1e1e] text-white border-t-2 border-primary" : "text-zinc-500 hover:bg-[#2a2d2e]"
            }`}
          >
            <span>{file.name}</span>
            <X className="h-3 w-3 hover:text-white" />
          </div>
        ))}
      </div>

      {/* Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-zinc-800">
        <div className="flex items-center gap-4">
          <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">
            {activeFile.language}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-white">
            <Save className="mr-2 h-3 w-3" />
            Save
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-400 hover:text-white">
            <Share2 className="mr-2 h-3 w-3" />
            Share
          </Button>
          <Button size="sm" variant="glow" className="h-7 text-xs px-4">
            <Play className="mr-2 h-3 w-3" />
            Run Scan
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={activeFile.language}
          value={activeFile.content}
          options={{
            minimap: { enabled: true },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 20 },
          }}
        />
      </div>
    </div>
  );
}
