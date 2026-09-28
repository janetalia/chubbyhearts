import { redirect } from "next/navigation";
import {
  createPasswordResetTokenHash,
  instantIsExpired,
} from "@/lib/password-reset";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email")?.toLowerCase() || "";
  const token = url.searchParams.get("token") || "";

  if (!email || !token) {
    redirect("/reset-password?error=invalid_token");
  }

  const tokenHash = createPasswordResetTokenHash(token);
  const verificationToken = await db.orm.public.VerificationToken
    .where({ identifier: email, token: tokenHash })
    .first();

  if (!verificationToken || instantIsExpired(verificationToken.expires)) {
    redirect("/reset-password?error=invalid_token");
  }

  redirect(
    `/reset-password/new?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`,
  );
}
