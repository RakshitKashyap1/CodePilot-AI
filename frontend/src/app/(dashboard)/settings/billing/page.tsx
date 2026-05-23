"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Clock } from "lucide-react";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Current Plan Card */}
      <GlassCard className="bg-glow border-primary/20 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl">Pro Plan</h3>
              <Badge variant="neon">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Next billing date: June 15, 2024 ($29.00)</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Manage Subscription</Button>
          <Button variant="glow" className="flex-1 md:flex-none">Upgrade to Enterprise</Button>
        </div>
      </GlassCard>

      {/* Usage Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Monthly Scans</h4>
            <span className="text-sm font-bold">1,240 / 5,000</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[25%]" />
          </div>
          <p className="text-xs text-muted-foreground">You have used 25% of your monthly scan quota.</p>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Connected Repos</h4>
            <span className="text-sm font-bold">3 / 10</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-purple-500 w-[30%]" />
          </div>
          <p className="text-xs text-muted-foreground">You have 7 repository slots remaining.</p>
        </GlassCard>
      </div>

      {/* Payment History */}
      <GlassCard className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Billing History</h2>
        </div>
        
        <div className="divide-y divide-border/50">
          {[
            { id: "INV-001", date: "May 15, 2024", amount: "$29.00", status: "Paid" },
            { id: "INV-002", date: "Apr 15, 2024", amount: "$29.00", status: "Paid" },
            { id: "INV-003", date: "Mar 15, 2024", amount: "$29.00", status: "Paid" },
          ].map((inv) => (
            <div key={inv.id} className="flex items-center justify-between py-4">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{inv.id}</p>
                <p className="text-xs text-muted-foreground">{inv.date}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold">{inv.amount}</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{inv.status}</Badge>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
