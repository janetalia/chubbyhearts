"use client";
import { useState } from "react";
import Link from "next/link";
import ActiveFosters from "./components/active-fosters";
import FeaturedPetCard from "./components/featured-pet-card";
import { useFosters } from "@/lib/fosters";

export default function HomePage() {
  const fosters = useFosters().filter(foster => foster.status === "active");
  const [selectedId, setSelectedId] = useState("max");
  const selected = fosters.find(foster => foster.id === selectedId) ?? fosters[0];
  console.log(fosters)
  console.log(selected)
  return <div className="max-w-[1239px]">
    <ActiveFosters fosters={fosters} onSelect={setSelectedId} />
    {selected ? <FeaturedPetCard foster={selected} /> : <div className="py-20 text-center"><h1 className="text-xl font-semibold">No active fosters yet</h1><Link href="/create-card" className="mt-5 inline-flex rounded-xl bg-primary px-6 py-3 text-white">Create a Card</Link></div>}
  </div>;
}
