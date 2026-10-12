import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { petToFoster } from "@/lib/pet-mappers";
import PublicShareButton from "./public-share-button";

export default async function PublicFosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pet = await db.orm.public.Pet.where({ id }).first();

  if (!pet || pet.status === "PAST") {
    return (
      <main className="min-h-screen bg-[#faf7ef] px-4 py-8 text-[#1a1a1a] md:px-8 md:py-12">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-block shrink-0">
            <Image
              src="/logo/Frame 2147235265.svg"
              alt="Chubby Hearts"
              width={160}
              height={47}
              priority
              className="h-10 w-auto md:h-11"
            />
          </Link>

          <Card className="mt-6 flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-[22px] border-[#ede9e4] bg-white p-12 text-center shadow-[0_12px_32px_rgba(0,0,0,0.08)]">
            <Image 
              src="/avatar/Image (Pet).svg" 
              alt="Archived Foster Illustration" 
              width={160} 
              height={160} 
              className="mb-8" 
            />
            <h1 className="text-2xl font-bold text-[#1a1a1a]">
              This card is no longer active.
            </h1>
          </Card>
        </div>
      </main>
    );
  }

  const foster = petToFoster(pet);
  const details = [
    { label: "Age", value: foster.age },
    { label: "Weight", value: foster.weight },
    { label: "Breed", value: foster.breed },
  ];

  return (
    <main className="min-h-screen bg-[#faf7ef] px-4 py-8 text-[#1a1a1a] md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="inline-block shrink-0">
          <Image
            src="/logo/Frame 2147235265.svg"
            alt="Chubby Hearts"
            width={160}
            height={47}
            priority
            className="h-10 w-auto md:h-11"
          />
        </Link>

        <Card className="mt-6 overflow-hidden rounded-[22px] border-[#ede9e4] bg-white p-0 shadow-[0_12px_32px_rgba(0,0,0,0.08)] md:grid md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[320px] bg-secondary md:min-h-[620px]">
              {foster.image ? (
                <Image
                  src={foster.image}
                  alt={foster.name}
                  fill
                  unoptimized
                  priority
                  sizes="(max-width: 767px) 100vw, 460px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center px-8 text-center text-sm font-semibold text-[#8a8178]">
                  No photo added yet
                </div>
              )}
              <div className="absolute left-4 top-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#e05a3a] shadow">
                Active Foster
              </div>
            </div>

            <section className="p-6 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#e05a3a]">
                {foster.rescue || "Foster profile"}
              </p>
              <h1 className="mt-3 font-heading text-[42px] font-bold leading-none md:text-[64px]">
                {foster.name}
              </h1>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {details.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-[#ede9e4] bg-[#fffaf2] p-4"
                  >
                    <p className="text-xs font-semibold text-[#8a8178]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#2d2925]">
                      {item.value || "Not added"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <div className="rounded-2xl border border-[#ede9e4] bg-[#fffaf2] p-4">
                  <h2 className="text-xs font-semibold text-[#8a8178]">
                    About {foster.name}
                  </h2>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#4a453f] wrap-anywhere">
                    {foster.about || "No story has been added yet."}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <PublicShareButton
                  id={foster.id}
                  name={foster.name}
                  className="w-full sm:w-auto sm:flex-1"
                />
                {foster.socialLink && (
                  <Button
                    render={
                      <Link
                        href={foster.socialLink}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    className="h-12 w-full rounded-[14px] bg-[#e05a3a] px-6 text-base hover:bg-[#c94d30] sm:w-auto sm:flex-1"
                  >
                    <ExternalLink className="size-4" />
                    Social Media
                  </Button>
                )}
                {foster.adoptionLink && (
                  <Button
                    render={
                      <Link
                        href={foster.adoptionLink}
                        target="_blank"
                        rel="noreferrer"
                      />
                    }
                    className="h-12 w-full rounded-[14px] px-6 text-base sm:w-auto sm:flex-1"
                  >
                    <ExternalLink className="size-4" />
                    Adoption Application
                  </Button>
                )}
              </div>
            </section>
          </Card>
      </div>
    </main>
  );
}
