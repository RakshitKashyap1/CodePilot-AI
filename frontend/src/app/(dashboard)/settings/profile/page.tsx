"use client";

import React from "react";
import { GlassCard } from "@/components/shared/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Camera } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <GlassCard className="space-y-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="h-24 w-24 rounded-full bg-accent flex items-center justify-center border-2 border-border group-hover:border-primary transition-colors overflow-hidden">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-white shadow-lg hover:scale-110 transition-transform">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">This will be displayed on your profile and reviews.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input defaultValue="Rakshit Kashyap" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <Input defaultValue="rakshitkashyap" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input defaultValue="rakshit@example.com" className="pl-10" />
            </div>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea 
              className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Tell us a bit about your coding journey..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="glow" onClick={handleSave}>Save Changes</Button>
        </div>
      </GlassCard>
    </div>
  );
}
