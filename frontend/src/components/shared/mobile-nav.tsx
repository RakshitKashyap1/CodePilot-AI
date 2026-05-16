"use client";

import React from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "@/components/shared/sidebar";

export function MobileNav() {
  return (
    <div className="lg:hidden flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72 glass-dark border-r-primary/20">
          <Sidebar />
        </SheetContent>
      </Sheet>
      <div className="ml-4 font-bold text-lg tracking-tight">CodePilot AI</div>
    </div>
  );
}
