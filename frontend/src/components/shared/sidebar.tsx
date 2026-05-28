"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DASHBOARD_NAV_ITEMS, SETTINGS_NAV_ITEMS } from "@/constants/navigation";
import { useAppStore } from "@/store/app-store";
import { useAuthStore } from "@/store/auth-store";
import { ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-border bg-card transition-all duration-300 ease-in-out",
        sidebarOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex h-full flex-col justify-between p-4">
        <div>
          {/* Logo */}
          <div className="mb-8 flex items-center justify-between px-2">
            {sidebarOpen && (
              <Link href="/dashboard" className="flex items-center gap-2 font-bold tracking-tight">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm text-white">C</span>
                </div>
                <span>CodePilot AI</span>
              </Link>
            )}
            {!sidebarOpen && (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary mx-auto">
                <span className="text-xs text-white font-bold">C</span>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {DASHBOARD_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  !sidebarOpen && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>

          <div className="my-6 border-t border-border/50" />

          {/* Settings Items */}
          <nav className="space-y-1">
            {SETTINGS_NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                  !sidebarOpen && "justify-center"
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {sidebarOpen && <span>{item.title}</span>}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="w-full justify-center lg:flex hidden"
          >
            {sidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
              sidebarOpen ? "justify-start px-3" : "justify-center"
            )}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
