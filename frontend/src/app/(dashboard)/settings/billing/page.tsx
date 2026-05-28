"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ArrowRight, Clock, Loader2 } from "lucide-react";
import { getCurrentSubscription, getPlans } from "@/services/subscription";
import { toast } from "sonner";

export default function BillingPage() {
  const [subscription, setSubscription] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      getCurrentSubscription().then(setSubscription).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const handleUpgrade = async () => {
    const plans = await getPlans().catch(() => null);
    if (!plans || plans.length === 0) {
      toast.error("No upgrade plans available");
      return;
    }
    toast.info("Redirecting to checkout...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const planName = subscription?.plan?.name ?? "Free";
  const planStatus = subscription?.status ?? "active";
  const periodEnd = subscription?.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : "—";
  const planPrice = subscription?.plan?.price ? `$${(subscription.plan.price / 100).toFixed(2)}` : "$0";

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
              <h3 className="font-bold text-xl">{planName} Plan</h3>
              <Badge variant="neon">{planStatus}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Next billing date: {periodEnd} ({planPrice})</p>
          </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none">Manage Subscription</Button>
          <Button variant="glow" className="flex-1 md:flex-none" onClick={handleUpgrade}>Upgrade Plan</Button>
        </div>
      </GlassCard>

      {/* Payment History */}
      <GlassCard className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-bold">Billing History</h2>
        </div>
        
        <p className="text-sm text-muted-foreground">No billing history available.</p>
      </GlassCard>
    </div>
  );
}
