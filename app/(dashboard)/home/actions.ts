"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db, nowInstant } from "@/lib/prisma";

export async function archivePet(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to archive a foster." };
  }

  const pet = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  if (!pet) {
    return { error: "Foster card not found." };
  }

  await db.orm.public.Pet.where({ id }).update({
    status: "PAST",
    endDate: nowInstant(),
    updatedAt: nowInstant(),
  });

  revalidatePath("/home");
  revalidatePath("/my-foster-family");

  return { success: "Foster archived." };
}

export async function deletePet(id: string) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to delete a foster." };
  }

  const pet = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  if (!pet) {
    return { error: "Foster card not found." };
  }

  await db.orm.public.Pet.where({ id }).delete();

  revalidatePath("/home");
  revalidatePath("/my-foster-family");

  return { success: "Foster card deleted." };
}
