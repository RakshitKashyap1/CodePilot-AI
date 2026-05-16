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

const MOCK_REPOS = [
  { name: "codepilot-backend", description: "The core AI engine for CodePilot", stars: 128, forks: 34, score: 94, status: "Connected" },
  { name: "frontend-ui", description: "Next.js dashboard and design system", stars: 45, forks: 12, score: 88, status: "Connected" },
  { name: "infra-utils", description: "Terraform and Kubernetes configs", stars: 12, forks: 2, score: 72, status: "Disconnected" },
];

export function RepoGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {MOCK_REPOS.map((repo, i) => (
        <GlassCard key={i} className="flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                <Github className="h-6 w-6 text-primary" />
              </div>
              <Badge variant={repo.status === "Connected" ? "neon" : "outline"}>
                {repo.status}
              </Badge>
            </div>
            
            <div>
              <h3 className="text-lg font-bold group-hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
                {repo.name}
                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {repo.description}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.stars}
              </div>
              <div className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {repo.forks}
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-500" /> AI Score: {repo.score}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
            <Button variant="link" className="p-0 h-auto text-xs text-primary">
              View Analytics
            </Button>
            <Button size="sm" variant={repo.status === "Connected" ? "secondary" : "glow"}>
              {repo.status === "Connected" ? "Manage" : "Connect"}
              <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </GlassCard>
      ))}

      {/* Add New Repo Card */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:bg-white/5 hover:border-primary/50 transition-all cursor-pointer group">
        <div className="h-12 w-12 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
          <Plus className="h-6 w-6 text-muted-foreground" />
        </div>
        <div>
          <p className="font-bold">Add Repository</p>
          <p className="text-xs text-muted-foreground mt-1">Import from GitHub or GitLab</p>
        </div>
      </div>
    </div>
  );
}
