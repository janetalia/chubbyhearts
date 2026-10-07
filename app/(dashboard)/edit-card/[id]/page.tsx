import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import { petToFoster } from "@/lib/pet-mappers";
import FosterEditForm from "../../components/foster-edit-form";

export default async function EditCardPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ unarchive?: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { id } = await params;
  const { unarchive } = await searchParams;
  const pet = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  return pet ? (
    <FosterEditForm key={pet.id} foster={petToFoster(pet)} isUnarchiving={unarchive === "true"} />
  ) : (
    <div>
      <h1 className="text-xl font-semibold">Card not found</h1>
      <Link href="/home" className="mt-4 inline-block text-primary">Back to Home</Link>
    </div>
  );
}
