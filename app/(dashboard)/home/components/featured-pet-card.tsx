"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Archive, Copy, MoreHorizontal, Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { HomePet } from "../home-client";
import { archivePet } from "../actions";

export default function FeaturedPetCard({ foster }: { foster: HomePet }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [flippedFosterId, setFlippedFosterId] = useState<string | null>(null);
  const flipped = flippedFosterId === foster.id;
  const sharePath = `/foster/${foster.id}`;

  const detailItems = [
    { label: "Age", value: foster.age },
    { label: "Weight", value: foster.weight },
    { label: "Breed", value: foster.breed },
  ];

  const toggleCard = () => setFlippedFosterId(current => current === foster.id ? null : foster.id);
  async function handleArchive() {
    setPending(true);
    setError("");

    const result = await archivePet(foster.id);

    if (result?.error) {
      setError(result.error);
      toast.error("Archive failed", { description: result.error });
    } else {
      toast.success("Foster archived", {
        description: `${foster.name} moved to your foster family.`,
      });
      router.refresh();
    }

    setPending(false);
  }

  async function handleCopyShare() {
    const url = `${window.location.origin}${sharePath}`;
    await navigator.clipboard.writeText(url);
    toast.success("Share link copied", {
      description: url,
    });
  }

  function handleOpenShare() {
    router.push(`/share/${foster.id}`);
  }

  return <section className="mt-3.5 md:mt-5.5">
    <div className="perspective-[1400px]">
      <div
        role="button"
        tabIndex={0}
        aria-label={`${flipped ? "Hide" : "View"} details for ${foster.name}`}
        aria-pressed={flipped}
        onClick={toggleCard}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleCard();
          }
        }}
        className={`relative min-h-130 cursor-pointer outline-none transition-transform duration-500 transform-3d focus-visible:ring-3 focus-visible:ring-primary/30 md:min-h-101.25 ${flipped ? "transform-[rotateY(180deg)]" : ""}`}
      >
        <Card className="absolute inset-0 flex gap-0 overflow-hidden rounded-[22.5px] border-[#ede9e4] bg-white p-0 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.1),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.1)] backface-hidden md:flex-row">
          <div className="relative h-64.25 shrink-0 overflow-hidden bg-secondary md:h-101 md:w-[32%]">
            {foster.image && <Image src={foster.image} alt={foster.name} fill unoptimized sizes="(max-width: 767px) 100vw, 395px" className={foster.id === "max" ? "hidden object-cover md:block" : "object-cover"} priority />}
            {foster.id === "max" && <Image src="/avatar/Image (Bella).svg" alt={foster.name} fill sizes="100vw" className="object-cover md:hidden" priority />}
            <div className="absolute left-4.25 top-4 flex items-center gap-1 rounded-full bg-white px-2 py-1 shadow md:gap-2 md:px-4 md:py-1.5">
              <span className="size-3 rounded-full bg-[#4caf50]" /><span className="text-sm font-semibold leading-5.5 text-[#e05a3a] md:text-[17px]">Active</span>
            </div>
            <Image src="/Vector.svg" alt="" width={108} height={109} className="absolute right-0 -top-10" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 md:gap-15.5 md:p-8.5">
            <div className="absolute right-4.5 top-4.5 z-10 md:right-6 md:top-5" onClick={event => event.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger render={<Button size="icon" aria-label={`More options for ${foster.name}`} title="Card options" className="size-8 rounded-full bg-white text-[#6f6b65] md:bg-primary md:text-white" />}><MoreHorizontal className="size-5" /></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 p-2">
                  <DropdownMenuItem onClick={() => router.push(`/edit-card/${foster.id}`)} className="gap-3 p-3"><Pencil />Edit Card</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyShare} className="gap-3 p-3"><Copy />Copy Share Link</DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive} disabled={pending} className="gap-3 p-3"><Archive />Archive Card</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div>
              <h1 className="font-heading text-[32px] font-bold leading-10.5 text-[#1a1a1a] md:text-[51px] md:leading-14">{foster.name}</h1>
              <p className="pt-2 text-base font-semibold leading-7 text-[#e05a3a] md:pt-1.5 md:text-[20px]">{foster.rescue}</p>
            </div>
            <div onClick={event => event.stopPropagation()}>
              <Button type="button" onClick={handleOpenShare} className="flex h-12 w-full items-center justify-center rounded-[16px] bg-primary text-base font-medium text-white hover:bg-primary/90 md:rounded-[12px]">
                Share
              </Button>
            </div>
          </div>
        </Card>

        <Card className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[22.5px] border-[#ede9e4] bg-white p-5 shadow-[0_5.6px_8.5px_-1.4px_rgba(0,0,0,0.1),0_2.8px_5.6px_-2.8px_rgba(0,0,0,0.1)] backface-hidden transform-[rotateY(180deg)] md:min-h-101.25 md:p-8.5">
          <div>
            {/* <div className="flex justify-end">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-[#e05a3a]">
                <RotateCcw className="size-5" />
              </div>
            </div> */}

            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {detailItems.map(item => (
                <div key={item.label}>
                  <p className="text-[13px] font-semibold leading-5">{item.label}</p>
                  <div className="mt-2 rounded-[16px] border border-input bg-white px-4 py-3.5">
                    <p className="text-sm leading-6 text-[#6b6b6b]">{item.value || "Not added yet"}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <p className="text-[13px] font-semibold leading-5">About them</p>
              <div className="mt-2 rounded-[16px] border border-input bg-white px-4 py-3.5">
                <p className="max-h-45 overflow-y-auto text-sm leading-6 text-[#4a4a4a] md:max-h-32.5">
                  {foster.about || "No about details have been added yet."}
                </p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-xs font-semibold text-[#8a8a8a]">Click the card to flip back</p>
        </Card>
      </div>
    </div>
    {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  </section>;
}
