"use client";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useFosters } from "@/lib/fosters";

export default function MyFosterFamilyPage() {
  const fosters = useFosters().filter(item => item.status === "past");
  return <div className="max-w-[1239px]">
    <h1 className="text-xl font-semibold leading-8">My Foster Family</h1>
    <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {fosters.map(foster => 
      <div key={foster.id} aria-label={`Edit ${foster.name}`} className="min-w-0 overflow-hidden rounded-[16px] border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
        <div className="relative aspect-[100/88] bg-secondary md:aspect-[233/160]">{foster.image && <Image src={foster.image} alt={foster.name} fill unoptimized sizes="(max-width: 767px) 30vw, 233px" className="object-cover" />}</div>
        <div className="min-h-11 px-2 py-3 text-sm font-medium md:px-3"><p className="truncate">{foster.name}</p></div>
      </div>)}
    </div>
    <section className="mt-12 flex flex-col gap-6 border rounded-[16px] border-border py-6 md:flex-row md:items-center md:px-5">
      <Image src="/avatar/DogIllustration.svg" alt="" width={80} height={80} className="size-20 shrink-0" />
      <div className="flex-1">
        <h2 className="text-base font-bold">Your foster journey lives here.</h2>
        <p className="mt-1 text-sm leading-6 text-[#6b6b6b]">Archive current foster cards or add past fosters
          <br className="hidden md:block" /> to remember them all in one place.</p>
          </div>
      <Link href="/my-foster-family/add" className="inline-flex h-[42px] w-fit items-center justify-center gap-1.5 rounded-[12px] border border-primary px-4 text-sm text-[#e05a3a] hover:bg-secondary">
      <Plus className="size-4" />Add a past foster
      </Link>
    </section>
  </div>;
}
