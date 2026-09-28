"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { FosterFamilySearchProvider } from "./components/foster-family-search-context";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  function toggleSidebar() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setMobileOpen((open) => !open);
    } else {
      setDesktopOpen((open) => !open);
    }
  }

  return (
    <FosterFamilySearchProvider>
      <div
        className="dashboard-shell min-h-dvh bg-white text-foreground"
        data-sidebar-open={desktopOpen}
      >
        <Navbar isSidebarOpen={desktopOpen} onToggleSidebar={toggleSidebar} />
        <div className="hidden md:block">
          <Sidebar open={desktopOpen} onToggle={toggleSidebar} />
        </div>
        <Dialog open={mobileOpen} onOpenChange={setMobileOpen}>
          <DialogContent
            showCloseButton={false}
            className="!inset-y-0 !left-0 !top-0 !h-dvh !w-[288px] !max-w-[85vw] !translate-x-0 !translate-y-0 !rounded-none !p-0"
          >
            <DialogTitle className="sr-only">Navigation</DialogTitle>
            <Sidebar open onToggle={() => setMobileOpen(false)} mobile />
          </DialogContent>
        </Dialog>
        <main className="dashboard-main min-w-0 px-5 pb-12 pt-[96px] md:px-[35px] md:pt-[106px]">
          {children}
        </main>
      </div>
    </FosterFamilySearchProvider>
  );
}
