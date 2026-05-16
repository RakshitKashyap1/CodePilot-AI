import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, BrainCircuit, Globe } from "lucide-react";

export function SystemStatus() {
  const systems = [
    { name: "Main API", status: "Operational", latency: "24ms", icon: Server, color: "text-green-500" },
    { name: "PostgreSQL DB", status: "Operational", latency: "12ms", icon: Database, color: "text-green-500" },
    { name: "AI Inference (v3)", status: "High Load", latency: "850ms", icon: BrainCircuit, color: "text-yellow-500" },
    { name: "CDN / Assets", status: "Operational", latency: "5ms", icon: Globe, color: "text-green-500" },
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
            <p className="text-xs text-muted-foreground">Latency: {system.latency}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
