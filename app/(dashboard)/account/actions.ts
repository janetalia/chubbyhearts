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
  firstName: z.string().trim().max(80).nullish().default(""),
  lastName: z.string().trim().max(80).nullish().default(""),
  phone: z.string().trim().max(40).nullish().default(""),
  image: z.string().trim().max(2_000_000).nullish().default(""),
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
    firstName: formData.get("firstName") ?? undefined,
    lastName: formData.get("lastName") ?? undefined,
    phone: formData.get("phone") ?? undefined,
    image: formData.get("image") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid account details." };
  }

  const firstName = parsed.data.firstName?.trim() || null;
  const lastName = parsed.data.lastName?.trim() || null;
  const phone = parsed.data.phone?.trim() || null;
  const image = parsed.data.image?.trim() || null;
  const name = [firstName, lastName].filter(Boolean).join(" ") || null;

  try {
    const updateData: {
      firstName: string | null;
      lastName: string | null;
      phone: string | null;
      name: string | null;
      updatedAt: ReturnType<typeof nowInstant>;
      image?: string | null;
    } = {
      firstName,
      lastName,
      phone,
      name,
      updatedAt: nowInstant(),
    };

    if (formData.has("image")) {
      updateData.image = image;
    }

    await db.orm.public.User.where({ id: session.user.id }).update(updateData);
  } catch (error) {
    console.error("Failed to update account:", error);
    return { error: "Failed to update account. Please try again." };
  }

  revalidatePath("/account");

  return { success: "Account updated successfully." };
}
