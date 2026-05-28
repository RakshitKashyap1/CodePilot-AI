"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { 
  Code2, 
  Terminal, 
  Zap, 
  ArrowUpRight, 
  MoreHorizontal,
  Clock,
  Loader2
} from "lucide-react";
import { Github } from "@/components/shared/icons";
import { getDashboardStats } from "@/services/dashboard";
import type { DashboardStats } from "@/services/dashboard";

const ReviewTrendsChart = dynamic(() => import("@/features/dashboard/components/review-trends-chart").then(mod => mod.ReviewTrendsChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />,
});

const LanguageUsageChart = dynamic(() => import("@/features/dashboard/components/language-usage-chart").then(mod => mod.LanguageUsageChart), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-white/5 animate-pulse rounded-xl" />,
});

import { QuickActions } from "@/features/dashboard/components/quick-actions";

export default function DashboardPage() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const overview = stats?.overview ?? { total_reviews: 0, completed_reviews: 0, average_score: 0 };
  const activityGraph = stats?.activity_graph?.map(d => ({ name: d.date, reviews: d.count })) ?? [];
  const languageData = stats?.language_usage?.map(d => ({ name: d.language, value: d.count })) ?? [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gradient">Dashboard</h1>
          <p className="text-muted-foreground">
            Analyze your codebase with AI-powered metrics and trends.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Last 7 Days
          </Button>
          <Button size="sm" variant="glow">
            Download Report
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Reviews", value: String(overview.total_reviews), trend: "+12%", icon: Terminal, color: "text-blue-500" },
          { label: "AI Insights", value: String(stats?.issue_breakdown ? Object.keys(stats.issue_breakdown).length * 10 : "1,042"), trend: "+24%", icon: Zap, color: "text-yellow-500" },
          { label: "Repositories", value: String(stats?.language_usage?.length || 0), trend: "0%", icon: Github, color: "text-purple-500" },
          { label: "Security Score", value: `${overview.average_score}/100`, trend: "+3%", icon: Code2, color: "text-green-500" },
        ].map((stat, i) => (
          <GlassCard key={i} className="relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg bg-white/5 p-2 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="text-[10px] font-bold border-white/10">
                {stat.trend}
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Review Trends Line Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Review Activity</h3>
              <p className="text-sm text-muted-foreground">Volume of AI code reviews over the last week.</p>
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
          <ReviewTrendsChart data={activityGraph} />
        </GlassCard>

        {/* Language Usage Pie Chart */}
        <GlassCard>
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Language Mix</h3>
            <p className="text-sm text-muted-foreground">Distribution of scanned codebases.</p>
          </div>
          <LanguageUsageChart data={languageData} />
        </GlassCard>
      </div>

      {/* Activity & AI Advice Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Reviews Table-like list */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Recent Reviews</h3>
            <Button variant="link" className="text-primary text-sm h-auto p-0">View All History</Button>
          </div>
          <div className="space-y-4">
            {[
              { name: "fix(auth): leaky token", repo: "codepilot-backend", score: 88, status: "critical" },
              { name: "feat: add vector search", repo: "ai-engine-v3", score: 96, status: "stable" },
              { name: "chore: update deps", repo: "frontend-ui", score: 92, status: "stable" },
            ].map((review, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/5 group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Code2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.repo}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={review.status === "critical" ? "destructive" : "neon"}>{review.status}</Badge>
                  <div className="text-right">
                    <p className="text-sm font-bold">{review.score}</p>
                    <p className="text-[10px] text-muted-foreground">AI SCORE</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Quick Actions & AI Spotlight */}
        <div className="space-y-6">
          <GlassCard className="bg-primary/5 border-primary/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </h3>
            <QuickActions />
          </GlassCard>

          <GlassCard className="bg-glow border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="ai" className="h-5">Pro Tip</Badge>
            </div>
            <p className="text-sm font-medium">Your Rust performance is peaking.</p>
            <p className="text-xs text-muted-foreground mt-2">
              We detected that your last 5 Rust commits followed zero-copy patterns perfectly. Your efficiency score is in the top 1% of users.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
