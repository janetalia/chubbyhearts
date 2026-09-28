import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db, nowInstant } from "@/lib/prisma";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await db.orm.public.User
          .where({ email: parsed.data.email.toLowerCase() })
          .first();

        if (!user?.passwordHash) return null;

        const validPassword = await compare(
          parsed.data.password,
          user.passwordHash,
        );

        if (!validPassword) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return true;

      const email = profile?.email?.toLowerCase();
      if (!email) return false;

      let user = await db.orm.public.User.where({ email }).first();

      if (!user) {
        const now = nowInstant();
        const googleProfile = profile as { picture?: unknown };

        user = await db.orm.public.User.create({
          email,
          name: profile?.name ?? null,
          image:
            typeof googleProfile.picture === "string"
              ? googleProfile.picture
              : null,
          emailVerified: now,
          createdAt: now,
          updatedAt: now,
        });
      }

      const existingAccount = await db.orm.public.Account
        .where({
          provider: account.provider,
          providerAccountId: account.providerAccountId,
        })
        .first();

      if (!existingAccount) {
        await db.orm.public.Account.create({
          userId: user.id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token ?? null,
          access_token: account.access_token ?? null,
          expires_at: account.expires_at ?? null,
          token_type: account.token_type ?? null,
          scope: account.scope ?? null,
          id_token: account.id_token ?? null,
          session_state:
            typeof account.session_state === "string"
              ? account.session_state
              : null,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (token.email) {
        const dbUser = await db.orm.public.User
          .where({ email: token.email.toLowerCase() })
          .first();

        if (dbUser) {
          token.id = dbUser.id;
        }
      } else if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
