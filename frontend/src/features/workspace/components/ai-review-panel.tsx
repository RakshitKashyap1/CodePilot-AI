"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ShieldAlert, 
  MessageSquare, 
  ChevronRight, 
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AIReviewPanel() {
  const [activeTab, setActiveTab] = React.useState<"suggestions" | "security" | "complexity">("suggestions");

  return (
    <div className="flex flex-col h-full bg-card/50 border-l border-border">
      {/* AI Header */}
      <div className="p-4 border-b border-border bg-primary/5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-4 w-4 text-primary animate-pulse" />
          <h3 className="font-bold text-sm uppercase tracking-widest">AI Analyst</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold">92</p>
            <p className="text-[10px] text-muted-foreground uppercase">Review Score</p>
          </div>
          <Badge variant="ai">Elite</Badge>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {[
          { id: "suggestions", icon: MessageSquare },
          { id: "security", icon: ShieldAlert },
          { id: "complexity", icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex justify-center py-3 transition-colors hover:bg-accent/50 ${
              activeTab === tab.id ? "border-b-2 border-primary text-primary bg-primary/5" : "text-muted-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === "suggestions" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              {[
                { title: "Optimization", text: "Use `Array.map` instead of `forEach` here for better readability.", line: 42 },
                { title: "Naming", text: "Rename `fn1` to `fetchUserData` to follow clean code principles.", line: 12 },
              ].map((s, i) => (
                <div key={i} className="p-3 rounded-lg bg-accent/30 border border-border/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="outline" className="text-[10px]">{s.title}</Badge>
                    <span className="text-[10px] text-muted-foreground">Line {s.line}</span>
                  </div>
                  <p className="text-xs leading-relaxed">{s.text}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-2 text-primary group-hover:underline">Apply Fix</Button>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4"
            >
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div className="flex items-center gap-2 mb-2 text-destructive">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase">Critical Finding</span>
                </div>
                <p className="text-xs font-medium">Potential SQL Injection vulnerability detected in raw query string.</p>
                <Button variant="destructive" size="sm" className="w-full mt-3 h-8">View Security Report</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-border bg-card">
        <Button className="w-full" variant="glow">
          <Zap className="mr-2 h-4 w-4" />
          Explain Selected Code
        </Button>
      </div>
    </div>
  );
}
