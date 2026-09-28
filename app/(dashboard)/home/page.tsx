import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { petToFoster } from "@/lib/pet-mappers";
import HomeClient from "./home-client";

export default async function HomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const pets = await db.orm.public.Pet
    .where({ userId: session.user.id, status: "ACTIVE" })
    .all();

  return <HomeClient fosters={pets.map(petToFoster)} />;
}
