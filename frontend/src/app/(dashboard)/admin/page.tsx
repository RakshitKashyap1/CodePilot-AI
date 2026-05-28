"use client";

import React from "react";
import { SystemStatus } from "@/features/admin/components/system-status";
import { RevenueChart } from "@/features/admin/components/revenue-chart";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Search,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { getSystemStatus, getRevenueMetrics, getUsers } from "@/services/admin";
import type { AdminUser } from "@/services/admin";

export default function AdminPage() {
  const [revenue, setRevenue] = React.useState<{ monthly_recurring: number; revenue_by_month: { month: string; revenue: number }[] } | null>(null);
  const [users, setUsers] = React.useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      getRevenueMetrics().then(setRevenue).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    getUsers({ search: userSearch || undefined })
      .then(setUsers)
      .catch(() => {});
  }, [userSearch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const mrr = revenue?.monthly_recurring ?? 0;
  const chartData = revenue?.revenue_by_month ?? [];

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
              <p className="text-2xl font-bold">${mrr.toLocaleString()}</p>
              <p className="text-xs text-green-500 font-bold flex items-center justify-end">
                <TrendingUp className="h-3 w-3 mr-1" /> +18.4%
              </p>
            </div>
          </div>
          <RevenueChart data={chartData} />
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
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="border-red-500/20">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Pending Reports
            </h3>
            <div className="space-y-4">
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
              <Input placeholder="Search users..." className="pl-9 h-9" value={userSearch} onChange={(e) => setUserSearch(e.target.value)} />
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
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u) => (
                <tr key={u.id} className="text-sm hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{u.username}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.is_active ? "neon" : "destructive"}>{u.is_active ? "Active" : "Inactive"}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.role}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.date_joined).toLocaleDateString()}</td>
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
