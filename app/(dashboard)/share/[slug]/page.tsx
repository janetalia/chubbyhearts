import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import { petToFoster } from "@/lib/pet-mappers";
import ShareFosterView from "./share-foster-view";

export default async function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pet = await db.orm.public.Pet.where({ id: slug }).first();

  if (!pet) notFound();

  return <ShareFosterView foster={petToFoster(pet)} />;
}