import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import MyFosterFamilyClient, { type FosterFamilyPet } from "./my-foster-family-client";

export default async function MyFosterFamilyPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const pets = await db.orm.public.Pet
    .where({ userId: session.user.id, status: "PAST" })
    .all();

  // Sort chronologically (newest first based on endDate, then startDate)
  pets.sort((a, b) => {
    const timeA = (a.endDate as any)?.epochMilliseconds || (a.startDate as any)?.epochMilliseconds || 0;
    const timeB = (b.endDate as any)?.epochMilliseconds || (b.startDate as any)?.epochMilliseconds || 0;
    return timeB - timeA;
  });

  return <MyFosterFamilyClient pastFosters={pets.map(toFosterFamilyPet)} />;
}

function toFosterFamilyPet(pet: {
  id: string;
  name: string;
  rescue: string | null;
  image: string | null;
  age: string | null;
  weight: string | null;
  breed: string | null;
  about: string | null;
  adoptionLink: string | null;
  startDate: unknown;
  endDate: unknown;
}): FosterFamilyPet {
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
    startDate: formatDate(pet.startDate),
    endDate: formatDate(pet.endDate),
  };
}

function formatDate(value: unknown) {
  if (!value) return "";
  if (typeof value === "object" && "epochMilliseconds" in value && typeof value.epochMilliseconds === "number") {
    return new Date(value.epochMilliseconds).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  return String(value);
}
