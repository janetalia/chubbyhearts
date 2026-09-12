"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Foster } from "@/lib/fosters";

export default function ActiveFosters({ fosters, onSelect }: { fosters: Foster[]; onSelect: (id: string) => void }) {
  return <section>
    <div className="flex h-7 items-center gap-2">
      <h2 className="text-sm font-semibold leading-5 text-[#3a3a3a]">Your active fosters</h2>
      <Heart className="size-4 fill-[#fb2c36] text-[#fb2c36]" />
    </div>
    <div className="mt-7 flex h-[124px] items-start gap-3 overflow-x-auto">
      {fosters.map(foster => <button key={foster.id} onClick={() => onSelect(foster.id)} aria-label={`View ${foster.name}`} className="flex w-[90px] shrink-0 flex-col items-center gap-1 rounded-2xl focus-visible:outline-2 focus-visible:outline-primary">
        <span className="relative block size-[90px] overflow-hidden rounded-2xl border border-[#f3f4f6] bg-secondary shadow-sm">
          {foster.image && <Image src={foster.image} alt="" fill sizes="90px" unoptimized className="object-cover" />}
        </span>
        <span className="max-w-full truncate text-xs leading-[18px] text-[#364153]">{foster.id === "max" ? "Lana" : foster.name}</span>
      </button>)}
      <Link href="/create-card" className="flex w-[90px] shrink-0 flex-col items-center gap-1" aria-label="Add new foster">
        <span className="flex size-[90px] items-center justify-center rounded-2xl border-2 border-dashed border-[#ff3e7f] text-[#ff3e7f]"><Plus className="size-7" strokeWidth={1.5} /></span>
        <span className="text-xs leading-[18px] text-[#364153]">Add new</span>
      </Link>
    </div>
  </section>;
}
