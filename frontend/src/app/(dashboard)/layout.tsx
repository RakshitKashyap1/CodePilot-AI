"use client";

import React from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";

import { MobileNav } from "@/components/shared/mobile-nav";
import { PageTransition } from "@/components/shared/page-transition";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0 border-r border-border bg-card/50 sticky top-0 h-screen">
        <Sidebar />
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <Navbar />
        <main id="main-content" className="p-4 lg:p-8 overflow-x-hidden">
          <PageTransition>
            {children}
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
