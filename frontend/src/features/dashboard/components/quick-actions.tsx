import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Search, Settings } from "lucide-react";
import { Github } from "@/components/shared/icons";

export function QuickActions() {
  const router = useRouter();

  const actions = [
    { title: "New Review", icon: Plus, variant: "glow" as const, onClick: () => router.push("/workspace") },
    { title: "Import Repo", icon: Github, variant: "outline" as const, onClick: () => router.push("/github") },
    { title: "Search AI", icon: Search, variant: "outline" as const, onClick: () => {} },
    { title: "Config AI", icon: Settings, variant: "outline" as const, onClick: () => router.push("/settings") },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, i) => (
        <Button
          key={i}
          variant={action.variant}
          onClick={action.onClick}
          className="h-20 flex flex-col items-center justify-center gap-2"
        >
          <action.icon className="h-5 w-5" />
          <span className="text-xs font-semibold">{action.title}</span>
        </Button>
      ))}
    </div>
  );
}
