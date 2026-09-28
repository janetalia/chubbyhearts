"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import ActiveFosters from "./components/active-fosters";
import FeaturedPetCard from "./components/featured-pet-card";

export type HomePet = {
  id: string;
  name: string;
  rescue: string;
  image: string;
  age: string;
  weight: string;
  breed: string;
  about: string;
  adoptionLink: string;
  status: "active" | "past";
  startDate: string;
  endDate: string;
};

export default function HomeClient({ fosters }: { fosters: HomePet[] }) {
  const [selectedId, setSelectedId] = useState(fosters[0]?.id ?? "");
  const selected = fosters.find((foster) => foster.id === selectedId) ?? fosters[0];

  return (
    <div className="max-w-309.75">
      {fosters.length > 0 && (
        <ActiveFosters fosters={fosters} onSelect={setSelectedId} />
      )}
      {selected ? (
        <FeaturedPetCard foster={selected} />
      ) : (
        <div className="relative overflow-hidden rounded-[22.5px] border border-[#ede9e4] bg-white p-5 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.08),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.08)] md:grid md:min-h-[405px] md:grid-cols-[0.92fr_1.08fr] md:p-0">
          <div className="relative min-h-[260px] overflow-hidden rounded-[18px] bg-[#faf7ef] md:min-h-[405px] md:rounded-none">
            <Image
              src="/avatar/DogIllustration.svg"
              alt=""
              fill
              priority
              sizes="(max-width: 767px) 100vw, 460px"
              className="object-contain object-bottom p-8 md:p-10"
            />
            <Image
              src="/Vector.svg"
              alt=""
              width={108}
              height={109}
              className="absolute -right-1 -top-10 opacity-90"
            />
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white px-4 py-1.5 shadow">
              <span className="size-3 rounded-full bg-[#4caf50]" />
              <span className="text-sm font-semibold text-[#e05a3a]">Ready when you are</span>
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center p-2 pt-6 md:p-[34px]">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-semibold text-[#e05a3a]">
              <Heart className="size-3.5 fill-[#fb2c36] text-[#fb2c36]" />
              Foster cards
            </div>
            <h1 className="mt-4 font-heading text-[34px] font-bold leading-[40px] text-[#1a1a1a] md:text-[51px] md:leading-[56px]">
              No active fosters yet
            </h1>
            <p className="mt-3 max-w-[520px] text-sm leading-6 text-[#6f6b65] md:text-base md:leading-7">
              Create your first foster card, then you can edit it, archive it, and share a public profile link from this home screen.
            </p>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <Link
                href="/create-card"
                className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-primary px-6 text-base font-medium text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-primary/90 md:rounded-[12px]"
              >
                <Plus className="size-4" />
                Create Card
              </Link>
              <div className="flex h-12 items-center justify-center gap-2 rounded-[16px] border border-[#ede9e4] bg-[#fffaf2] px-4 text-sm font-semibold text-[#6f6b65] md:rounded-[12px]">
                <Share2 className="size-4 text-[#e05a3a]" />
                Share after saving
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
