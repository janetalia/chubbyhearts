import nodemailer from "nodemailer";
import { z } from "zod";
import type { FieldInputTypes } from "@/prisma/schema";
import {
  createPasswordResetToken,
  createPasswordResetTokenHash,
  instantFromEpochMilliseconds,
} from "@/lib/password-reset";
import { db } from "@/lib/prisma";

const resetPasswordSchema = z.object({
  email: z.string().trim().email().max(254),
  website: z.string().max(200).optional().default(""),
});

const successMessage =
  "Please check your email. A reset link has been sent.";

type VerificationTokenExpiresInput =
  FieldInputTypes["public"]["VerificationToken"]["expires"];

function getBaseUrl(request: Request) {
  const host =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto") ||
    (host?.includes("localhost") || host?.includes("127.0.0.1") ? "http" : "https");

  if (host) {
    return `${protocol}://${host}`;
  }

  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
    new URL(request.url).origin
  );
}

function createResetEmailText(resetUrl: string) {
  return [
    "Reset your Chubby Hearts password",
    "",
    "We received a request to reset your password.",
    "",
    `Reset link: ${resetUrl}`,
    "",
    "This link is valid for 24 hours and can only be used once.",
    "If you did not request this, you can ignore this email.",
    "",
    "Chubby Hearts",
  ].join("\n");
}

function createResetEmailHTML(resetUrl: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset your password - Chubby Hearts</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #252525;
      background-color: #f9f5eb;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 560px;
      margin: 32px auto;
      background: #ffffff;
      border-radius: 28px;
      border: 1px solid #ede9e4;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(217, 111, 97, 0.12);
    }
    .header {
      background: #ee9266;
      color: #ffffff;
      padding: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .header p {
      margin: 6px 0 0;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content h2 {
      margin: 0 0 10px;
      color: #1a1a1a;
      font-size: 22px;
    }
    .content p {
      margin: 0 auto 18px;
      color: #6f6b65;
      font-size: 14px;
      max-width: 420px;
    }
    .button {
      display: inline-block;
      margin: 8px 0 18px;
      padding: 14px 24px;
      border-radius: 16px;
      background: #ee9266;
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      box-shadow: 0 4px 8px rgba(217, 111, 97, 0.3);
    }
    .notice {
      margin-top: 10px;
      padding: 14px 16px;
      border-radius: 16px;
      background: #f9f5eb;
      color: #6f6b65;
      font-size: 13px;
    }
    .fallback {
      word-break: break-all;
      color: #e05a3a;
      font-size: 12px;
    }
    .footer {
      padding: 18px 30px;
      text-align: center;
      border-top: 1px solid #ede9e4;
      color: #8a857e;
      font-size: 12px;
      background: #fffaf3;
    }
    @media (max-width: 600px) {
      .container { margin: 12px; border-radius: 22px; }
      .header, .content { padding: 24px 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Chubby Hearts</h1>
      <p>Share their story with just a scan</p>
    </div>
    <div class="content">
      <h2>Reset your password</h2>
      <p>We received a request to reset your password. Use the button below to continue.</p>
      <a class="button" href="${resetUrl}">Reset password</a>
      <div class="notice">This link is valid for 24 hours and can only be used once. If you did not request this, you can ignore this email.</div>
      <p style="margin-top: 18px;">If the button does not work, copy this link:</p>
      <p class="fallback">${resetUrl}</p>
    </div>
    <div class="footer">Chubby Hearts password reset</div>
  </div>
</body>
</html>
  `;
}

function createTransporter() {
  const email = process.env.APP_EMAIL?.trim();
  const password = (process.env.APP_PASSWORD || "").replace(/\s+/g, "").trim();

  if (!email || !password) {
    throw new Error("APP_EMAIL and APP_PASSWORD must be set.");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  });
}

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
          details: parsed.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
          message: "Please enter a valid email address.",
        },
      },
      { status: 422 },
    );
  }

  if (parsed.data.website.trim() !== "") {
    return Response.json({ data: { message: successMessage } }, { status: 201 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await db.orm.public.User.where({ email }).first();

  if (!user) {
    return Response.json(
      {
        error: {
          code: "user_not_found",
          message:
            "No account found with this email address. Please make sure you have registered first.",
        },
      },
      { status: 404 },
    );
  }

  const token = createPasswordResetToken();
  const tokenHash = createPasswordResetTokenHash(token);
  const expires = instantFromEpochMilliseconds(
    Date.now() + 24 * 60 * 60 * 1000,
  ) as VerificationTokenExpiresInput;
  const resetUrl = `${getBaseUrl(request)}/reset-password/verify?token=${token}&email=${encodeURIComponent(email)}`;

  try {
    await db.orm.public.VerificationToken
      .where({ identifier: email })
      .delete();
  } catch {
    // No previous token for this email.
  }

  await db.orm.public.VerificationToken.create({
    identifier: email,
    token: tokenHash,
    expires,
  });

  try {
    const fromEmail = process.env.APP_EMAIL?.trim();
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `Chubby Hearts <${fromEmail}>`,
      to: email,
      subject: "Reset your Chubby Hearts password",
      text: createResetEmailText(resetUrl),
      html: createResetEmailHTML(resetUrl),
    });

    return Response.json({ data: { message: successMessage } }, { status: 201 });
  } catch (error) {
    console.error("Failed to send password reset email.", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return Response.json(
      {
        error: {
          code: "email_failed",
          message: "Email delivery is temporarily unavailable.",
        },
      },
      { status: 502, headers: { "Retry-After": "300" } },
    );
  }
}
