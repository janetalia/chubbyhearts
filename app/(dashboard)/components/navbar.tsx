"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFosterFamilySearch } from "./foster-family-search-context";

export default function Navbar({
  isSidebarOpen,
  onToggleSidebar,
}: {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const pathname = usePathname();
  const { search, setSearch } = useFosterFamilySearch();
  const isFosterFamilyPage = pathname === "/my-foster-family";

  return (
    <header className="dashboard-navbar fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-5 md:h-[79px] md:border-b md:border-border md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-6">
        <Button
          variant="ghost"
          size="icon"
          className={isSidebarOpen ? "md:hidden" : ""}
          title="Open navigation"
          aria-label="Open navigation"
          onClick={onToggleSidebar}
        >
          <Menu className="size-[24px]" />
        </Button>
        <Link href="/home" className="mobile-brand shrink-0">
          <Image
            src="/logo/Frame 2147235265.svg"
            alt="Chubby Hearts"
            width={160}
            height={47}
            priority
            className="h-[42px] w-[144px] md:h-[47px] md:w-[160px]"
          />
        </Link>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-2 pl-3 md:gap-3 md:pl-6">
        {isFosterFamilyPage && (
          <div className="relative min-w-0 flex-1 md:max-w-[360px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8a8a8a]" />
            <Input
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
              placeholder="Search foster family"
              aria-label="Search foster family"
              className="h-10 rounded-[12px] bg-white pl-9 pr-10 text-sm md:h-11"
            />
            {search && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
                className="absolute right-1 top-1/2 size-8 -translate-y-1/2 rounded-full md:size-9"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>
        )}
        <Link
          href={isFosterFamilyPage ? "/my-foster-family/add" : "/create-card"}
          aria-label={isFosterFamilyPage ? "Add a past foster" : "Create card"}
          title={isFosterFamilyPage ? "Add a past foster" : "Create card"}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white hover:bg-primary/90 md:size-9"
        >
          <Plus className="size-4" />
        </Link>
      </div>
    </header>
  );
}
