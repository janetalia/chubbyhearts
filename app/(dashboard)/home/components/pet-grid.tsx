"use client";

import PetCard, { PetData } from "./pet-card";

interface PetGridProps {
  onOpenQR: (petName: string, tagId: string) => void;
}

export default function PetGrid({ onOpenQR }: PetGridProps) {
  const pets: PetData[] = [
    {
      id: "pet-1",
      name: "Buddy",
      breed: "Golden Retriever Mix",
      age: "2 yrs 4 mos",
      weight: "48.5 lbs",
      status: "Active Foster",
      imageSrc: "/avatar/Image (Buddy).svg",
      tagId: "CH-88294-PET",
      lastFed: "2 hrs ago",
    },
    {
      id: "pet-2",
      name: "Luna",
      breed: "Domestic Shorthair",
      age: "8 mos",
      weight: "7.2 lbs",
      status: "Ready for Adoption",
      imageSrc: "/avatar/Image (Lana).svg",
      tagId: "CH-44102-PET",
      lastFed: "4 hrs ago",
    },
    {
      id: "pet-3",
      name: "Charlie",
      breed: "Australian Shepherd",
      age: "1 yr 2 mos",
      weight: "34.0 lbs",
      status: "Medical Hold",
      imageSrc: "/avatar/Image (Bella).svg",
      tagId: "CH-91823-PET",
      lastFed: "1 hr ago",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Your Foster Pets
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Manage pet profiles, QR tags, and medical care logs.
          </p>
        </div>
        <span className="text-xs font-bold text-rose-500 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          {pets.length} Active Assignments
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} onOpenQR={onOpenQR} />
        ))}
      </div>
    </div>
  );
}
