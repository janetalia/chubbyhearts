import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import EditPastFosterForm from "../../../components/edit-past-foster-form";
import { petToFoster } from "@/lib/pet-mappers";

function formatDateInput(value: unknown) {
  if (!value) return "";
  if (typeof value === "object" && "epochMilliseconds" in value && typeof value.epochMilliseconds === "number") {
    return new Date(value.epochMilliseconds).toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

export default async function EditFosterFamilyPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const { id } = await params;
  const pet = await db.orm.public.Pet
    .where({ id, userId: session.user.id })
    .first();

  if (!pet || pet.status !== "PAST") {
    notFound();
  }

  const draft = {
    ...petToFoster(pet),
    startDate: formatDateInput(pet.startDate),
    endDate: formatDateInput(pet.endDate),
  };

  return (
    <div>
      <EditPastFosterForm foster={draft} />
    </div>
  );
}
