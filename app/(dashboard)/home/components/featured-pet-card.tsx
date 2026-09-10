"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { saveFoster, type Foster } from "@/lib/fosters";

export default function FeaturedPetCard({ foster }: { foster: Foster }) {
  const router = useRouter();
  const [error, setError] = useState("");
  return <section className="mt-[14px] md:mt-[22px]">
    <Card className="relative flex gap-0 overflow-hidden rounded-[22.5px] border-[#ede9e4] bg-white p-0 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.1),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.1)] md:min-h-[405px] md:flex-row">
      <div className="relative h-[257px] shrink-0 overflow-hidden bg-secondary md:h-[404px] md:w-[32%]">
        {foster.image && <Image src={foster.image} alt={foster.name} fill unoptimized sizes="(max-width: 767px) 100vw, 395px" className={foster.id === "max" ? "hidden object-cover md:block" : "object-cover"} priority />}
        {foster.id === "max" && <Image src="/avatar/Image (Bella).svg" alt={foster.name} fill sizes="100vw" className="object-cover md:hidden" priority />}
        <div className="absolute left-[17px] top-4 flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow md:gap-2 md:px-4 md:py-1.5">
          <span className="size-3 rounded-full bg-[#4caf50]" /><span className="text-sm font-semibold leading-[22px] text-[#e05a3a] md:text-[17px]">Active</span>
        </div>
        <Image src="/Vector.svg" alt="" width={108} height={109} className="absolute -right-0 -top-10" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 md:gap-[62px] md:p-[34px]">
        <div className="absolute right-[18px] top-[18px] z-10 md:right-6 md:top-5">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="icon" aria-label={`More options for ${foster.name}`} title="Card options" className="size-8 rounded-full bg-white text-[#6f6b65] md:bg-primary md:text-white" />}><MoreHorizontal className="size-5" /></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-2">
              <DropdownMenuItem onClick={() => router.push(`/edit-card/${foster.id}`)} className="gap-3 p-3"><Pencil />Edit Card</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { try { saveFoster({ ...foster, status: "past", endDate: new Date().toISOString().slice(0, 10) }); } catch { setError("Could not archive this card. Please try again."); } }} className="gap-3 p-3"><Archive />Archive Card</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          <h1 className="font-heading text-[32px] font-bold leading-[42px] text-[#1a1a1a] md:text-[51px] md:leading-[56px]">{foster.name}</h1>
          <p className="pt-2 text-base font-semibold leading-7 text-[#e05a3a] md:pt-1.5 md:text-[20px]">{foster.rescue}</p>
        </div>
        <Link href={`/share/${foster.id}`} className="flex h-12 w-full items-center justify-center rounded-[16px] bg-primary text-base font-medium text-white hover:bg-primary/90 md:rounded-[12px]">Share</Link>
      </div>
    </Card>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}
