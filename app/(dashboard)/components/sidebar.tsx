"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { navigationItems } from "./navigation-items";

export default function Sidebar({ open, onToggle, mobile = false }: { open: boolean; onToggle: () => void; mobile?: boolean }) {
  const pathname = usePathname();
  return (
    <aside inert={!open} aria-label="Main navigation" className={cn("flex h-dvh w-[288px] max-w-full flex-col justify-between border-r border-sidebar-border bg-sidebar", !mobile && "fixed left-0 top-0 z-40 transition-transform", !open && "-translate-x-full")}>
      <div>
        <div className="flex h-[78px] items-center border-b border-sidebar-border px-6">
          <Button variant="ghost" size="icon" title="Close navigation" aria-label="Close navigation" aria-expanded={open} onClick={onToggle}>
            {mobile ? <X className="size-[22px]" /> : <Menu className="size-[22px]" />}
          </Button>
        </div>
        <nav className="space-y-0.5 px-4 py-3">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return <Link key={href} href={href} aria-current={active ? "page" : undefined} onClick={mobile ? onToggle : undefined} className={cn("flex min-h-[51px] items-center gap-3 rounded-2xl px-3 text-[15px] font-medium hover:bg-sidebar-accent", active && "bg-sidebar-accent")}><Icon className={cn("size-[18px] shrink-0", active && "text-[#e05a3a]")} />{label}</Link>;
          })}
        </nav>
      </div>
      <Link href="/signin" onClick={mobile ? onToggle : undefined} className="flex h-[74px] shrink-0 items-center gap-3 border-t border-sidebar-border px-7 text-[15px] font-medium text-[#d96f61] hover:bg-sidebar-accent"><LogOut className="size-[18px]" />Log out</Link>
    </aside>
  );
}
