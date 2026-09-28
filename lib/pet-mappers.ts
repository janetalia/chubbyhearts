import type { Foster } from "@/lib/foster-schema";

export type PetRecord = {
  id: string;
  name: string;
  rescue: string | null;
  image: string | null;
  age: string | null;
  weight: string | null;
  breed: string | null;
  about: string | null;
  adoptionLink: string | null;
  status: "ACTIVE" | "PAST";
};

export function petToFoster(pet: PetRecord): Foster {
  return {
    id: pet.id,
    name: pet.name,
    rescue: pet.rescue || "",
    image: pet.image || "",
    age: pet.age || "",
    weight: pet.weight || "",
    breed: pet.breed || "",
    about: pet.about || "",
    adoptionLink: pet.adoptionLink || "",
    status: pet.status === "ACTIVE" ? "active" : "past",
    startDate: "",
    endDate: "",
  };
}
