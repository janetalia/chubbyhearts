"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, MoreHorizontal, Pencil, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { saveFoster, type Foster } from "@/lib/fosters";

export default function FeaturedPetCard({ foster }: { foster: Foster }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [flippedFosterId, setFlippedFosterId] = useState<string | null>(null);
  const flipped = flippedFosterId === foster.id;

  const detailItems = [
    { label: "Age", value: foster.age },
    { label: "Weight", value: foster.weight },
    { label: "Breed", value: foster.breed },
  ];

  const toggleCard = () => setFlippedFosterId(current => current === foster.id ? null : foster.id);

  return <section className="mt-[14px] md:mt-[22px]">
    <div className="perspective-[1400px]">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${flipped ? "Hide" : "View"} details for ${foster.name}`}
        aria-pressed={flipped}
        onClick={toggleCard}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
          }
        }}
        className={`relative min-h-[520px] cursor-pointer outline-none transition-transform duration-500 [transform-style:preserve-3d] focus-visible:ring-3 focus-visible:ring-primary/30 md:min-h-[405px] ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        <Card className="absolute inset-0 flex gap-0 overflow-hidden rounded-[22.5px] border-[#ede9e4] bg-white p-0 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.1),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.1)] [backface-visibility:hidden] md:flex-row">
          <div className="relative h-[257px] shrink-0 overflow-hidden bg-secondary md:h-[404px] md:w-[32%]">
            {foster.image && <Image src={foster.image} alt={foster.name} fill unoptimized sizes="(max-width: 767px) 100vw, 395px" className={foster.id === "max" ? "hidden object-cover md:block" : "object-cover"} priority />}
            {foster.id === "max" && <Image src="/avatar/Image (Bella).svg" alt={foster.name} fill sizes="100vw" className="object-cover md:hidden" priority />}
            <div className="absolute left-[17px] top-4 flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow md:gap-2 md:px-4 md:py-1.5">
              <span className="size-3 rounded-full bg-[#4caf50]" /><span className="text-sm font-semibold leading-[22px] text-[#e05a3a] md:text-[17px]">Active</span>
            </div>
            <Image src="/Vector.svg" alt="" width={108} height={109} className="absolute -right-0 -top-10" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 md:gap-[62px] md:p-[34px]">
            <div className="absolute right-[18px] top-[18px] z-10 md:right-6 md:top-5" onClick={event => event.stopPropagation()}>
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
            <Link href={`/share/${foster.id}`} onClick={event => event.stopPropagation()} className="flex h-12 w-full items-center justify-center rounded-[16px] bg-primary text-base font-medium text-white hover:bg-primary/90 md:rounded-[12px]">Share</Link>
          </div>
        </Card>

        <Card className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[22.5px] border-[#ede9e4] bg-white p-5 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.1),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.1)] [backface-visibility:hidden] [transform:rotateY(180deg)] md:min-h-[405px] md:p-[34px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold leading-5 text-[#e05a3a]">Foster details</p>
                <h2 className="mt-1 font-heading text-[32px] font-bold leading-[42px] text-[#1a1a1a] md:text-[44px] md:leading-[52px]">{foster.name}</h2>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-[#e05a3a]">
                <RotateCcw className="size-5" />
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              {detailItems.map(item => (
                <div key={item.label} className="rounded-[16px] border border-[#ede9e4] bg-[#f9f5eb] p-4">
                  <p className="text-xs font-semibold uppercase text-[#8a8a8a]">{item.label}</p>
                  <p className="mt-1 text-base font-semibold text-[#252525]">{item.value || "Not added yet"}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-[16px] border border-[#ede9e4] p-4">
              <p className="text-xs font-semibold uppercase text-[#8a8a8a]">About</p>
              <p className="mt-2 max-h-[180px] overflow-y-auto text-sm leading-6 text-[#4a4a4a] md:max-h-[130px]">
                {foster.about || "No about details have been added yet."}
              </p>
            </div>
          </div>

          <p className="mt-5 text-center text-xs font-semibold text-[#8a8a8a]">Click the card to flip back</p>
        </Card>
      </div>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}
