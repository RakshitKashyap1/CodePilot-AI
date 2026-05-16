import { ReviewTable } from "@/features/history/components/review-table";
import { GlassCard } from "@/components/shared/glass-card";
import { History, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Review History | CodePilot AI",
  description: "View and manage your past AI code reviews.",
};

export default function HistoryPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gradient">Review History</h1>
        <p className="text-muted-foreground">
          Track your code quality improvements and security findings over time.
        </p>
      </div>

      {/* History Overview Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Total Reviews", value: "128", icon: History, color: "text-blue-500" },
          { label: "Critical Fixed", value: "42", icon: CheckCircle2, color: "text-green-500" },
          { label: "Open Issues", value: "7", icon: AlertTriangle, color: "text-red-500" },
        ].map((stat, i) => (
          <GlassCard key={i} className="flex items-center gap-4 py-4">
            <div className={`rounded-lg bg-white/5 p-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Main Table Section */}
      <ReviewTable />
    </div>
  );
}
