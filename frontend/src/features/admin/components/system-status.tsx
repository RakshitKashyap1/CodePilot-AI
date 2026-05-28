import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, BrainCircuit, Globe } from "lucide-react";
import { getSystemStatus } from "@/services/admin";

export function SystemStatus() {
  const [status, setStatus] = React.useState<{ database: string; redis: string; ai_service: string; uptime_hours: number } | null>(null);

  React.useEffect(() => {
    getSystemStatus().then(setStatus).catch(() => {});
  }, []);

  const systems = [
    { name: "Main API", status: "Operational", latency: `${status?.uptime_hours ?? 0}h uptime`, icon: Server, color: "text-green-500" },
    { name: "PostgreSQL DB", status: status?.database === "healthy" ? "Operational" : "Degraded", latency: "", icon: Database, color: status?.database === "healthy" ? "text-green-500" : "text-yellow-500" },
    { name: "AI Inference", status: status?.ai_service === "healthy" ? "Operational" : status?.ai_service === "degraded" ? "High Load" : "Down", latency: "", icon: BrainCircuit, color: status?.ai_service === "healthy" ? "text-green-500" : "text-yellow-500" },
    { name: "Redis Cache", status: status?.redis === "healthy" ? "Operational" : "Degraded", latency: "", icon: Globe, color: status?.redis === "healthy" ? "text-green-500" : "text-yellow-500" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {systems.map((system, i) => (
        <GlassCard key={i} className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className={`p-2 rounded-lg bg-white/5 ${system.color}`}>
              <system.icon className="h-5 w-5" />
            </div>
            <Badge 
              variant="outline" 
              className={system.status === "Operational" ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"}
            >
              {system.status}
            </Badge>
          </div>
          <div>
            <p className="text-sm font-bold">{system.name}</p>
            {system.latency && <p className="text-xs text-muted-foreground">{system.latency}</p>}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
