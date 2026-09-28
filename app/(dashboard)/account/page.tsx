import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import AccountForm from "./account-form";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await db.orm.public.User.where({ id: session.user.id }).first();

  if (!user) {
    redirect("/signin");
  }

  const accounts = await db.orm.public.Account
    .where({ userId: user.id })
    .all();
  const hasGoogleAccount = accounts.some((account) => account.provider === "google");
  const accountUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    image: user.image,
    createdAt:
      typeof user.createdAt === "object" &&
      user.createdAt !== null &&
      "epochMilliseconds" in user.createdAt &&
      typeof user.createdAt.epochMilliseconds === "number"
        ? user.createdAt.epochMilliseconds
        : String(user.createdAt),
  };

  return <AccountForm user={accountUser} hasGoogleAccount={hasGoogleAccount} />;
}
