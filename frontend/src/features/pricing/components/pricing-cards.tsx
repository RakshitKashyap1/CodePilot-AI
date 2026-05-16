"use client";

import React from "react";
import { Check, Zap, Rocket, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/glass-card";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for students and open-source contributors.",
    features: ["5 Repositories", "100 AI Scans / month", "Standard Support", "Basic Security Analysis"],
    icon: Zap,
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for professional developers and startups.",
    features: ["Unlimited Repositories", "5,000 AI Scans / month", "Priority Support", "Advanced Security + Perf Analysis", "Custom AI Rules"],
    icon: Rocket,
    variant: "glow" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated support and infrastructure for large teams.",
    features: ["Unlimited Everything", "Self-hosted option", "Dedicated Account Manager", "SSO & Audit Logs", "Custom Model Training"],
    icon: Building2,
    variant: "outline" as const,
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {PLANS.map((plan, i) => (
        <GlassCard 
          key={i} 
          className={`relative flex flex-col justify-between p-8 border-2 transition-all duration-300 ${
            plan.popular ? "border-primary/50 shadow-[0_0_40px_rgba(59,130,246,0.15)] scale-105" : "border-border/50 hover:border-border"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <Badge variant="ai" className="px-4 py-1">MOST POPULAR</Badge>
            </div>
          )}

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center bg-white/5 ${plan.popular ? "text-primary" : "text-muted-foreground"}`}>
                <plan.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">{plan.name}</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== "Custom" && <span className="text-muted-foreground ml-2">/month</span>}
            </div>

            <p className="text-sm text-muted-foreground mb-8">{plan.description}</p>

            <ul className="space-y-4">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm">
                  <Check className="h-5 w-5 text-primary shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Button 
            className="w-full mt-10" 
            variant={plan.variant}
            size="lg"
          >
            {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
          </Button>
        </GlassCard>
      ))}
    </div>
  );
}
