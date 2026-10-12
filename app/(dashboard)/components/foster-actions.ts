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
        socialLink: string | null;
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
      socialLink: foster.socialLink.trim() || null,
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

export async function createPastFoster(input: Foster): Promise<SaveFosterResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to add a past foster." };
  }

  const cleaned = cleanFoster({ ...input, status: "past" });

  if ("error" in cleaned) {
    return { error: cleaned.error };
  }

  if (!input.rescue.trim()) {
    return { error: "Please enter the rescue name." };
  }

  if (!input.startDate) {
    return { error: "Please select a start date." };
  }

  if (!input.endDate) {
    return { error: "Please select an end date." };
  }

  if (input.endDate < input.startDate) {
    return { error: "End date can't be before the start date." };
  }

  const now = nowInstant();

  await db.orm.public.Pet.create({
    ...cleaned.foster,
    userId: session.user.id,
    startDate: instantFromDateInput(input.startDate),
    endDate: instantFromDateInput(input.endDate),
    createdAt: now,
    updatedAt: now,
  });

  revalidatePath("/my-foster-family");

  return { success: true, redirectTo: "/my-foster-family" };
}

export async function deletePastFoster(id: string): Promise<{ success: true } | { error: string }> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to remove a past foster." };
  }

  const foster = await db.orm.public.Pet
    .where({ id, userId: session.user.id, status: "PAST" })
    .first();

  if (!foster) {
    return { error: "Past foster not found." };
  }

  await db.orm.public.Pet
    .where({ id, userId: session.user.id, status: "PAST" })
    .delete();

  revalidatePath("/my-foster-family");
  revalidatePath("/my-foster-family/add");
  revalidatePath("/my-foster-family/edit");
  revalidatePath("/add");

  return { success: true };
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
  const newStartDate = input.startDate 
    ? instantFromDateInput(input.startDate) 
    : existing.startDate;

  const newEndDate = cleaned.foster.status === "ACTIVE" 
    ? null 
    : (input.endDate ? instantFromDateInput(input.endDate) : (existing.status === "ACTIVE" ? now : existing.endDate));

  await db.orm.public.Pet.where({ id }).update({
    ...cleaned.foster,
    startDate: newStartDate,
    endDate: newEndDate,
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

export async function unarchiveFoster(id: string): Promise<SaveFosterResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to unarchive." };
  }

  const existing = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  if (!existing) {
    return { error: "Foster card not found." };
  }

  const now = nowInstant();

  await db.orm.public.Pet.where({ id }).update({
    status: "ACTIVE",
    endDate: null,
    updatedAt: now,
  });

  revalidatePath("/home");
  revalidatePath("/my-foster-family");
  revalidatePath(`/foster/${id}`);

  return { success: true, redirectTo: "/home" };
}

function instantFromDateInput(value: string): ReturnType<typeof nowInstant> {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);
  const temporal = (globalThis as typeof globalThis & {
    Temporal: {
      Instant: {
        fromEpochMilliseconds: (epochMilliseconds: number) => ReturnType<typeof nowInstant>;
      };
    };
  }).Temporal;

  return temporal.Instant.fromEpochMilliseconds(timestamp);
}
