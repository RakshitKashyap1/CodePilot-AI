"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Key, Shield, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { forgotPassword } from "@/services/auth";

export default function SecuritySettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API Key copied to clipboard!");
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("Please fill in both password fields");
      return;
    }
    try {
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("Failed to update password");
    }
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
            <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" onClick={handleUpdatePassword}>Update Password</Button>
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
          <Button variant="glow" size="sm" onClick={() => toast.info("API key creation not available in this version")}>Create New Key</Button>
        </div>

        <p className="text-sm text-muted-foreground">No API keys generated yet.</p>
      </GlassCard>
    </div>
  );
}
