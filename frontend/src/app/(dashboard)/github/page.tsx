import { RepoGrid } from "@/features/github/components/repo-grid";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GitPullRequest, 
  Settings, 
  ExternalLink
} from "lucide-react";
import { Github } from "@/components/shared/icons";

export const metadata = {
  title: "GitHub Integration | CodePilot AI",
  description: "Connect and manage your GitHub repositories for AI code review.",
};

export default function GithubPage() {
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
          <Button size="sm" variant="glow">
            Import Repository
          </Button>
        </div>
      </div>

      {/* Integration Status Card */}
      <GlassCard className="bg-primary/5 border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircleIcon className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-bold">Connected as @rakshitkashyap</h3>
            <p className="text-sm text-muted-foreground">Successfully linked to your GitHub account. All webhooks are active.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge variant="neon">Webhooks Active</Badge>
          <Badge variant="outline">OAuth v2</Badge>
        </div>
      </GlassCard>

      {/* Main Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Your Repositories</h2>
          <p className="text-sm text-muted-foreground">3 Connected Repos</p>
        </div>
        <RepoGrid />
      </div>

      {/* Active Pull Requests Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <GitPullRequest className="h-5 w-5 text-primary" />
          Pending Pull Requests
        </h2>
        <GlassCard className="p-0 overflow-hidden">
          <div className="divide-y divide-border">
            {[
              { title: "feat: add vector database support", author: "alice", repo: "codepilot-backend", pr: "#42", date: "1h ago" },
              { title: "fix: resolve memory leak in editor", author: "bob", repo: "frontend-ui", pr: "#128", date: "4h ago" },
            ].map((pr, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-8 w-8 rounded bg-accent flex items-center justify-center">
                    <GitPullRequest className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">{pr.title}</p>
                    <p className="text-xs text-muted-foreground">{pr.repo} {pr.pr} by @{pr.author} • {pr.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-3">
                  Review in Workspace
                  <ExternalLink className="ml-2 h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
          {/* No PRs footer or empty state would go here */}
        </GlassCard>
      </div>
    </div>
  );
}

function CheckCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
