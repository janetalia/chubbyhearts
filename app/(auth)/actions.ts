"use server";

import { AuthError } from "next-auth";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/auth";
import { db, nowInstant } from "@/lib/prisma";

export type AuthFormState = {
  error?: string;
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, "Enter your first name."),
  lastName: z.string().trim().min(1, "Enter your last name."),
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

function authErrorMessage(error: unknown) {
  if (error instanceof AuthError) {
    return "Invalid email or password.";
  }
  return "Something went wrong. Please try again.";
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/home" });
}

export async function loginWithPassword(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/home",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: authErrorMessage(error) };
    }
    throw error;
  }

  return {};
}

export async function registerWithPassword(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message };
  }

  const email = parsed.data.email.toLowerCase();
  const existingUser = await db.orm.public.User.where({ email }).first();

  if (existingUser) {
    return { error: "An account already exists for this email." };
  }

  const passwordHash = await hash(parsed.data.password, 12);
  const now = nowInstant();

  await db.orm.public.User.create({
    email,
    passwordHash,
    firstName: parsed.data.firstName,
    lastName: parsed.data.lastName,
    name: `${parsed.data.firstName} ${parsed.data.lastName}`,
    createdAt: now,
    updatedAt: now,
  });

  redirect("/signin?registered=1");
}
