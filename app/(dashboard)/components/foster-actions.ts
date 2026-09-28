"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, nowInstant } from "@/lib/prisma";
import { fosterSchema, type Foster } from "@/lib/foster-schema";

type SaveFosterResult =
  | { error: string }
  | { success: true; redirectTo: string };

type CleanFosterResult =
  | { error: string }
  | {
      foster: {
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
    };

function cleanFoster(input: Foster): CleanFosterResult {
  const parsed = fosterSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Please check the card details and try again." };
  }

  const foster = parsed.data;
  const name = foster.name.trim();

  if (!name) {
    return { error: "Please enter your pet's name." };
  }

  if (foster.adoptionLink && !/^https?:\/\//i.test(foster.adoptionLink)) {
    return { error: "Use an adoption link starting with https:// or http://." };
  }

  if (foster.image.length > 2_000_000) {
    return { error: "Please use a smaller profile image." };
  }

  return {
    foster: {
      name,
      rescue: foster.rescue.trim() || null,
      image: foster.image || null,
      age: foster.age.trim() || null,
      weight: foster.weight.trim() || null,
      breed: foster.breed.trim() || null,
      about: foster.about.trim() || null,
      adoptionLink: foster.adoptionLink.trim() || null,
      status: foster.status === "past" ? "PAST" as const : "ACTIVE" as const,
    },
  };
}

export async function createFoster(input: Foster): Promise<SaveFosterResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to create a foster card." };
  }

  const cleaned = cleanFoster(input);

  if ("error" in cleaned) {
    return { error: cleaned.error };
  }

  const now = nowInstant();

  await db.orm.public.Pet.create({
    ...cleaned.foster,
    userId: session.user.id,
    startDate: cleaned.foster.status === "ACTIVE" ? now : null,
    endDate: cleaned.foster.status === "PAST" ? now : null,
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/home");
  revalidatePath("/my-foster-family");

  return {
    success: true,
    redirectTo: cleaned.foster.status === "PAST" ? "/my-foster-family" : "/home",
  };
}

export async function updateFoster(id: string, input: Foster): Promise<SaveFosterResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to update this foster card." };
  }

  const existing = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  if (!existing) {
    return { error: "Foster card not found." };
  }

  const cleaned = cleanFoster(input);

  if ("error" in cleaned) {
    return { error: cleaned.error };
  }

  const now = nowInstant();

  await db.orm.public.Pet.where({ id }).update({
    ...cleaned.foster,
    endDate: cleaned.foster.status === "PAST" ? now : null,
    updatedAt: now,
  });

  revalidatePath("/home");
  revalidatePath("/my-foster-family");
  revalidatePath(`/foster/${id}`);

  return {
    success: true,
    redirectTo: cleaned.foster.status === "PAST" ? "/my-foster-family" : "/home",
  };
}
