import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  gradient = false,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-dark rounded-xl p-6 transition-all duration-300 hover:border-white/20",
        gradient && "bg-gradient-to-br from-white/5 to-transparent",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
