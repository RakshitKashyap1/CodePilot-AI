"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function SecuritySettingsPage() {
  const [keys] = React.useState([
    { id: "1", name: "Development Key", value: "cp_live_492...8a3", date: "May 12, 2024" },
    { id: "2", name: "Production Key", value: "cp_live_128...2f1", date: "May 01, 2024" },
  ]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      {/* Password Section */}
      <GlassCard className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <Shield className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Password & Authentication</h2>
            <p className="text-sm text-muted-foreground">Keep your account secure with a strong password.</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Current Password</label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline">Update Password</Button>
        </div>
      </GlassCard>

      {/* API Keys Section */}
      <GlassCard className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Key className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">API Access Keys</h2>
              <p className="text-sm text-muted-foreground">Use these keys to integrate CodePilot AI into your CI/CD.</p>
            </div>
          </div>
          <Button variant="glow" size="sm">Create New Key</Button>
        </div>

        <div className="space-y-3">
          {keys.map((key) => (
            <div key={key.id} className="flex items-center justify-between p-4 rounded-lg bg-accent/30 border border-border/50 group">
              <div className="space-y-1">
                <p className="text-sm font-bold">{key.name}</p>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-muted-foreground bg-black/40 px-2 py-0.5 rounded">{key.value}</code>
                  <Badge variant="outline" className="text-[10px]">Active</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">Created on {key.date}</p>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(key.value)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
