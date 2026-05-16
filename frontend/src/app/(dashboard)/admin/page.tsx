import { SystemStatus } from "@/features/admin/components/system-status";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Search,
  Download,
  Filter
} from "lucide-react";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Admin Dashboard | CodePilot AI",
  description: "Platform management and analytics.",
};

export default function AdminPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Admin Console
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">v1.2.4</Badge>
          </h1>
          <p className="text-muted-foreground">
            Monitor platform health, revenue, and user growth in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
          <Button size="sm" variant="glow">
            Refresh Metrics
          </Button>
        </div>
      </div>

      {/* System Status Grid */}
      <SystemStatus />

      {/* Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold">Revenue Growth</h3>
              <p className="text-sm text-muted-foreground">Monthly Recurring Revenue (MRR) trends.</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">$8,900</p>
              <p className="text-xs text-green-500 font-bold flex items-center justify-end">
                <TrendingUp className="h-3 w-3 mr-1" /> +18.4%
              </p>
            </div>
          </div>
          <RevenueChart />
        </GlassCard>

        {/* User Stats Card */}
        <div className="space-y-6">
          <GlassCard className="bg-primary/5 border-primary/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Active Users</p>
                <p className="text-2xl font-bold">12,482</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Free Tier</span>
                <span>84%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[84%]" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-red-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Pending Reports
            </h3>
            <div className="space-y-4">
              {[
                { user: "jdoe99", reason: "Excessive API usage", time: "2m ago" },
                { user: "dev_smith", reason: "Potential bot activity", time: "15m ago" },
              ].map((report, i) => (
                <div key={i} className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold">@{report.user}</p>
                    <p className="text-[10px] text-muted-foreground">{report.reason}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{report.time}</span>
                </div>
              ))}
              <Button variant="outline" className="w-full text-xs h-8">Review All Reports</Button>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* User Management List Preview */}
      <GlassCard>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-lg font-semibold">User Management</h3>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {[
                { name: "Rakshit Kashyap", email: "rakshit@example.com", status: "Active", plan: "Pro", joined: "May 2024" },
                { name: "Alice Freeman", email: "alice@tech.io", status: "Active", plan: "Starter", joined: "Apr 2024" },
                { name: "Bob Martin", email: "bob@clean.code", status: "Suspended", plan: "Enterprise", joined: "Jan 2024" },
              ].map((user, i) => (
                <tr key={i} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={user.status === "Active" ? "neon" : "destructive"}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{user.plan}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.joined}</td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
