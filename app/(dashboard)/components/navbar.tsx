"use client";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navbar({
  isSidebarOpen,
  onToggleSidebar,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  return (
    <header className="dashboard-navbar fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-5 md:h-19.75 md:border-b md:border-border md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <Button
          variant="ghost"
          size="icon"
          className={isSidebarOpen ? "md:hidden" : ""}
          title="Open navigation"
          aria-label="Open navigation"
          onClick={onToggleSidebar}
        >
          <Menu className="size-6" />
        </Button>
        <Link href="/home" className="mobile-brand shrink-0">
          <Image
            src="/logo/Frame 2147235265.svg"
            alt="Chubby Hearts"
            width={160}
            height={47}
            priority
            className="h-10.5 w-36 md:h-11.75 md:w-40"
          />
        </Link>
      </div>
      <div className="min-w-0 flex-1" />
    </header>
  );
}
