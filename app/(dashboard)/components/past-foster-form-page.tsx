import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/prisma";
import PastFosterForm from "./past-foster-form";

export default async function PastFosterFormPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const pets = await db.orm.public.Pet
    .where({ userId: session.user.id, status: "PAST" })
    .all();

  return (
    <PastFosterForm
      recentPastFosters={pets.map((pet) => ({
        id: pet.id,
        name: pet.name,
        image: pet.image || "",
        startDate: formatDateInput(pet.startDate),
        endDate: formatDateInput(pet.endDate),
      }))}
    />
  );
}

function formatDateInput(value: unknown) {
  if (!value) return "";
  if (typeof value === "object" && "epochMilliseconds" in value && typeof value.epochMilliseconds === "number") {
    return new Date(value.epochMilliseconds).toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}