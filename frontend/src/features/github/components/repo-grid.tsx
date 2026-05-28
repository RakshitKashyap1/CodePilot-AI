"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Star, 
  GitFork, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink,
  Plus
} from "lucide-react";
import { Github } from "@/components/shared/icons";

interface Repo {
  name: string;
  url?: string;
  private?: boolean;
}

export function RepoGrid({ repos, onImport }: { repos: Repo[]; onImport?: () => void }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {repos.map((repo, i) => (
        <GlassCard key={i} className="flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <Badge variant={repo.private ? "outline" : "neon"}>
                {repo.private ? "Private" : "Public"}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                {repo.name}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
            </div>
          </div>
        </GlassCard>
      ))}

      {/* Add New Repo Card */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer group" onClick={onImport}>
        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-bold">Add Repository</p>
          <p className="text-xs text-muted-foreground mt-1">Import from GitHub</p>
        </div>
      </div>
    </div>
  );
}
