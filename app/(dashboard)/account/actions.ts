"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db, nowInstant } from "@/lib/prisma";

export type AccountFormState = {
  error?: string;
  success?: string;
};

const accountSchema = z.object({
  firstName: z.string().trim().max(80).optional().default(""),
  lastName: z.string().trim().max(80).optional().default(""),
  phone: z.string().trim().max(40).optional().default(""),
  image: z.string().trim().max(2_000_000).optional().default(""),
});

export async function updateAccount(
  _previousState: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "You must be signed in to update your account." };
  }

  const parsed = accountSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid account details." };
  }

  const firstName = parsed.data.firstName || null;
  const lastName = parsed.data.lastName || null;
  const name = [firstName, lastName].filter(Boolean).join(" ") || null;

  await db.orm.public.User.where({ id: session.user.id }).update({
    firstName,
    lastName,
    phone: parsed.data.phone || null,
    image: parsed.data.image || null,
    name,
    updatedAt: nowInstant(),
  });

  revalidatePath("/account");

  return { success: "Account updated successfully." };
}
