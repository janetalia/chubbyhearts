import { hash } from "bcryptjs";
import { z } from "zod";
import {
  createPasswordResetTokenHash,
  instantIsExpired,
} from "@/lib/password-reset";
import { db, nowInstant } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
  token: z.string().min(20),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json(
      {
        error: {
          code: "invalid_json",
          message: "The request could not be read.",
        },
      },
      { status: 400 },
    );
  }

  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        error: {
          code: "validation_error",
          message: parsed.error.issues[0]?.message || "Invalid request.",
        },
      },
      { status: 422 },
    );
  }

  const email = parsed.data.email.toLowerCase();
  const tokenHash = createPasswordResetTokenHash(parsed.data.token);
  const verificationToken = await db.orm.public.VerificationToken
    .where({ identifier: email, token: tokenHash })
    .first();

  if (!verificationToken || instantIsExpired(verificationToken.expires)) {
    return Response.json(
      {
        error: {
          code: "invalid_token",
          message: "Your reset link is invalid or expired. Please request a new link.",
        },
      },
      { status: 401 },
    );
  }

  const user = await db.orm.public.User.where({ email }).first();
  if (!user) {
    return Response.json(
      {
        error: {
          code: "invalid_token",
          message: "Your reset link is invalid or expired. Please request a new link.",
        },
      },
      { status: 401 },
    );
  }

  const passwordHash = await hash(parsed.data.password, 12);

  await db.orm.public.User.where({ id: user.id }).update({
    passwordHash,
    updatedAt: nowInstant(),
  });

  await db.orm.public.VerificationToken
    .where({ identifier: email, token: tokenHash })
    .delete();

  return Response.json(
    { data: { message: "Password reset successfully." } },
    { status: 200 },
  );
}
