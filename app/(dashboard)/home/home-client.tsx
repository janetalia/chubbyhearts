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
          </div>

          <div className="flex min-w-0 flex-col justify-center p-2 pt-6 md:p-8.5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#fff1e9] px-3 py-1 text-xs font-semibold text-[#e05a3a]">
              <Heart className="size-3.5 fill-[#fb2c36] text-[#fb2c36]" />
              Foster cards
            </div>
            <h1 className="mt-4 font-heading text-[34px] font-bold leading-10 text-[#1a1a1a] md:text-[51px] md:leading-14">
              No active fosters
            </h1>
            <p className="mt-3 max-w-130 text-sm leading-6 text-[#6f6b65] md:text-base md:leading-7">
               Add a
pet you're fostering to
get started. You can
edit, archive, or share
the card anytime
            </p>

            <div className="mt-6 grid gap-2">
              <Link
                href="/create-card"
                className="flex h-12 items-center justify-center gap-2 rounded-[16px] bg-primary px-6 text-base font-medium text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-primary/90 md:rounded-[12px]"
              >
                <Plus className="size-4" />
                Create Card
              </Link>
             
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
