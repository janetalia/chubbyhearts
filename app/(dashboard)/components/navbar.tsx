"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Plus, Search, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { navigationItems } from "./navigation-items";

export default function Navbar({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen: boolean; onToggleSidebar: () => void }) {
  const router = useRouter();
  return (
    <header className="dashboard-navbar fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-5 md:h-[79px] md:border-b md:border-border md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <Button variant="ghost" size="icon" className={isSidebarOpen ? "md:hidden" : ""} title="Open navigation" aria-label="Open navigation" onClick={onToggleSidebar}><Menu className="size-[24px]" /></Button>
        <Link href="/home" className="mobile-brand shrink-0"><Image src="/logo/Frame 2147235265.svg" alt="Chubby Hearts" width={160} height={47} priority className="h-[42px] w-[144px] md:h-[47px] md:w-[160px]" /></Link>
      </div>
      <div className="flex items-center gap-1 md:gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" title="Search navigation" aria-label="Search navigation" className="size-9 rounded-full" />}><Search className="size-5" /></DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={12} className="w-[240px] p-2">
            {navigationItems.map(({ label, href, icon: Icon }) => <DropdownMenuItem key={href} onClick={() => router.push(href)} className="gap-3 px-3 py-3"><Icon className="size-[18px]" />{label}</DropdownMenuItem>)}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/signin")} className="gap-3 px-3 py-3 text-[#d96f61]"><LogOut className="size-[18px]" />Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link href="/create-card" aria-label="Create card" title="Create card" className="hidden size-9 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 md:flex"><Plus className="size-4" /></Link>
      </div>
    </header>
  );
}
