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

  // Sort by startDate (newest to oldest). If missing startDate, show at the end.
  pets.sort((a, b) => {
    const timeA = getEpochMs(a.startDate);
    const timeB = getEpochMs(b.startDate);

    if (!timeA && !timeB) {
      const createdA = getEpochMs((a as any).createdAt);
      const createdB = getEpochMs((b as any).createdAt);
      return createdB - createdA;
    }
    if (!timeA) return 1;
    if (!timeB) return -1;

    if (timeB !== timeA) {
      return timeB - timeA;
    }

    const createdA = getEpochMs((a as any).createdAt);
    const createdB = getEpochMs((b as any).createdAt);
    return createdB - createdA;
  });

  return <MyFosterFamilyClient pastFosters={pets.map(toFosterFamilyPet)} />;
}

function getEpochMs(value: unknown): number {
  if (!value) return 0;
  if (typeof value === "object") {
    try {
      if ("epochMilliseconds" in (value as any) && typeof (value as any).epochMilliseconds === "number") {
        return (value as any).epochMilliseconds;
      }
      if (value instanceof Date) {
        const time = value.getTime();
        return isNaN(time) ? 0 : time;
      }
      const parsed = Date.parse(String(value));
      return isNaN(parsed) ? 0 : parsed;
    } catch {
      return 0;
    }
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  if (typeof value === "number" && !isNaN(value)) {
    return value;
  }
  return 0;
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
  const ms = getEpochMs(value);
  if (!ms) return "";
  return new Date(ms).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
