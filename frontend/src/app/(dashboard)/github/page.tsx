"use client";

import React from "react";
import { RepoGrid } from "@/features/github/components/repo-grid";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitPullRequest, 
  Settings, 
  ExternalLink,
  Loader2
} from "lucide-react";
import { Github } from "@/components/shared/icons";
import { listRepositories, getOAuthUrl } from "@/services/github";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GithubPage() {
  const [githubUser, setGithubUser] = React.useState<string | null>(null);
  const [repos, setRepos] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    listRepositories()
      .then((data) => {
        setRepos(data);
        setGithubUser("connected");
      })
      .catch(() => {
        setGithubUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleImport = async () => {
    try {
      const url = await getOAuthUrl();
      if (url) window.location.href = url;
      else toast.error("GitHub OAuth not configured");
    } catch {
      toast.error("GitHub OAuth not configured");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Github className="h-8 w-8" />
            GitHub Integration
          </h1>
          <p className="text-muted-foreground">
            Manage your connected repositories and automated PR reviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Integration Settings
          </Button>
          <Button size="sm" variant="glow" onClick={handleImport}>
            Import Repository
          </Button>
        </div>
      </div>

      {/* Integration Status Card */}
      <GlassCard className="bg-primary/5 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-full ${githubUser ? "bg-green-500/20" : "bg-yellow-500/20"} flex items-center justify-center`}>
            <svg className={`h-6 w-6 ${githubUser ? "text-green-500" : "text-yellow-500"}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {githubUser ? (
                <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>
              ) : (
                <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>
              )}
            </svg>
          </div>
          <div>
            <h3 className="font-bold">{githubUser ? "Connected" : "Not Connected"}</h3>
            <p className="text-sm text-muted-foreground">{githubUser ? "Successfully linked to your GitHub account." : "Connect your GitHub account to enable automated PR reviews."}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant={githubUser ? "neon" : "outline"}>{githubUser ? "Connected" : "Disconnected"}</Badge>
        </div>
      </GlassCard>

      {/* Main Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Repositories</h2>
          <p className="text-sm text-muted-foreground">{repos.length} Connected Repos</p>
        </div>
        <RepoGrid repos={repos} onImport={handleImport} />
      </div>
    </div>
  );
}
