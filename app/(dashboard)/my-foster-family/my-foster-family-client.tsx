"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { CalendarDays, Eye, Plus, Search, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFosterFamilySearch } from "../components/foster-family-search-context";
import { deletePastFoster } from "../components/foster-actions";

export type FosterFamilyPet = {
  id: string;
  name: string;
  rescue: string;
  image: string;
  age: string;
  weight: string;
  breed: string;
  about: string;
  adoptionLink: string;
  startDate: string;
  endDate: string;
};

export default function MyFosterFamilyClient({
  pastFosters,
}: {
  pastFosters: FosterFamilyPet[];
}) {
  const { search, setSearch } = useFosterFamilySearch();
  const [selected, setSelected] = useState<FosterFamilyPet | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deletePending = useRef(false);
  const router = useRouter();
  const canDeleteSelected = Boolean(
    selected?.id && pastFosters.some((foster) => foster.id === selected.id),
  );

  const searchTerms = useMemo(() => {
    return search
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  }, [search]);

  const fosters = useMemo(() => {
    if (searchTerms.length === 0) return pastFosters;

    return pastFosters.filter((foster) => {
      const searchableFields = [
        foster.name,
        foster.rescue,
        foster.breed,
        foster.age,
        foster.weight,
        foster.about,
        foster.startDate,
        foster.endDate,
      ];

      return searchTerms.every((term) =>
        searchableFields.some((field) =>
          field ? field.toLowerCase().includes(term) : false,
        ),
      );
    });
  }, [pastFosters, searchTerms]);

  const handleResetSearch = () => {
    setSearch("");
  };

  async function handleDelete() {
    if (!selected || !canDeleteSelected || deletePending.current) return;
    if (
      !window.confirm(
        `Permanently delete ${selected.name} from your past fosters? This action cannot be undone.`,
      )
    ) return;

    deletePending.current = true;
    setIsDeleting(true);

    try {
      const result = await deletePastFoster(selected.id);

      if ("error" in result) {
        toast.error("Past foster was not removed", { description: result.error });
        return;
      }

      toast.success("Past foster removed");
      setSelected(null);
      router.refresh();
    } catch {
      toast.error("Past foster was not removed", {
        description: "Please try again.",
      });
    } finally {
      deletePending.current = false;
      setIsDeleting(false);
    }
  }

  return (
    <div className="max-w-309.75">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-semibold leading-8">My Foster Family</h1>

          <Link
            href="/my-foster-family/add"
            aria-label="Add a past foster"
            title="Add a past foster"
          >
            <Button className="inline-flex h-6 shrink-0 items-center justify-center rounded-full bg-[#ee9266] px-2.5 text-sm font-semibold leading-none text-white shadow-[0_2px_4px_rgba(217,111,97,0.3)] hover:bg-[#df8358] md:hidden">
              + Add
            </Button>
          </Link>
        </div>

        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/my-foster-family/add"
            aria-label="Add a past foster"
            title="Add a past foster"
            className="hidden md:inline-block"
          >
            <Button className="hidden h-10 items-center gap-2 rounded-[16px] bg-[#ee9266] px-4.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358] md:flex">
              <span>+</span>
              <span>Add</span>
            </Button>
          </Link>

          {(pastFosters.length > 0 || search.length > 0) && (
            <div className="relative min-w-0 w-full md:mt-0 md:w-88">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8a8a8a]" />
              <Input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    handleResetSearch();
                  }
                }}
                placeholder="Search"
                aria-label="Search foster family"
                className="h-10 rounded-[12px] bg-white pl-9.5 pr-9 text-sm focus-visible:ring-1 focus-visible:ring-[#ee9266]"
              />
              {search.length > 0 && (
                <button
                  type="button"
                  onClick={handleResetSearch}
                  aria-label="Reset search"
                  title="Reset search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-6 items-center justify-center rounded-full text-[#8a8a8a] transition-colors hover:bg-[#f3ede4] hover:text-[#1a1a1a] focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {search.trim().length > 0 && fosters.length === 0 ? (
        <div className="my-10 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-[#e5e0d8] bg-[#fbf9f5] px-6 py-12 text-center">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#f3ede4] text-[#8a8178]">
            <Search className="size-5" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-[#1a1a1a]">
            No fosters found
          </h3>
          <p className="mt-1 max-w-sm text-sm text-[#736c64]">
            No past fosters match &ldquo;{search.trim()}&rdquo;. Try another name, breed, or rescue.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleResetSearch}
            className="mt-4 h-9 rounded-[12px] border-[#e0d9cf] bg-white px-4 text-sm font-medium hover:bg-[#f5f1eb]"
          >
            Reset search
          </Button>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-3 gap-x-4 gap-y-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mb-6">
          {fosters.map((foster) => (
            <button
              key={foster.id}
              type="button"
              onClick={() => setSelected(foster)}
              aria-label={`View ${foster.name}`}
              className="min-w-0 overflow-hidden rounded-[16px] border border-border bg-white text-left shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-primary"
            >
              <div className="relative aspect-100/88 bg-secondary md:aspect-233/160">
                {foster.image ? (
                  <Image
                    src={foster.image}
                    alt={foster.name}
                    fill
                    unoptimized
                    sizes="(max-width: 767px) 30vw, 233px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold text-[#9A9A9A]">
                    No photo
                  </div>
                )}
              </div>
              <div className="min-h-11 px-2 py-3 text-sm font-medium md:px-3">
                <p className="truncate">{foster.name}</p>
                <p className="mt-0.5 hidden truncate text-xs text-[#8a8a8a] md:block">
                  {foster.rescue || "Rescue not added"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}

      <section className="flex flex-col gap-6 rounded-[16px] border border-border px-5 py-6 md:flex-row md:items-center">
        <Image
          src="/avatar/DogIllustration.svg"
          alt=""
          width={80}
          height={80}
          className="size-20 shrink-0"
        />
        <div className="flex-1">
          <h2 className="text-base font-bold">
            Your foster journey lives here.
          </h2>
          <p className="mt-1 text-sm leading-6 text-[#6b6b6b]">
            Every pet you've fostered,
            <br className="hidden md:block" /> celebrated in one place.
          </p>
        </div>
        <Link
          href="/my-foster-family/add"
          className="inline-flex h-10.5 w-fit items-center justify-center gap-1.5 rounded-[12px] border border-primary px-4 text-sm text-[#e05a3a] hover:bg-secondary"
        >
          <Plus className="size-4" />
          Add a past foster
        </Link>
      </section>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !deletePending.current) setSelected(null);
        }}
      >
        <DialogContent className="rounded-[22px] bg-white p-0 sm:max-w-130 overflow-hidden flex flex-col max-h-[90vh]">
          {selected && (
            <>
              <div className="overflow-y-auto flex-1">
                <div className="relative h-57.5 shrink-0 overflow-hidden rounded-t-[22px] bg-secondary">
                  {selected.image ? (
                    <Image
                      src={selected.image}
                      alt={selected.name}
                      fill
                      unoptimized
                      sizes="520px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-[#9A9A9A]">
                      No photo added
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <DialogHeader>
                    <DialogTitle className="font-heading text-[32px] font-bold leading-9 text-[#1a1a1a]">
                      {selected.name}
                    </DialogTitle>
                    <DialogDescription className="font-semibold text-[#e05a3a]">
                      {selected.rescue || "Rescue not added"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                    <Detail label="Breed" value={selected.breed} />
                    <Detail label="Age" value={selected.age} />
                    <Detail label="Weight" value={selected.weight} />
                    <Detail
                      label="Dates"
                      value={formatRange(selected.startDate, selected.endDate)}
                      icon={<CalendarDays className="size-4 text-[#e05a3a]" />}
                    />
                  </div>
                  <div className="mt-5 rounded-[16px] border border-input bg-white px-4 py-3.5">
                    <p className="text-[13px] font-semibold leading-5 text-[#252525]">
                      About them
                    </p>
                    <p className="mt-2 wrap-anywhere text-sm leading-6 text-[#4a4a4a] whitespace-pre-wrap">
                      {selected.about ||
                        "No about details have been added yet."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="shrink-0 border-t border-[#ede9e4] bg-white p-4 grid grid-cols-2 gap-3 sm:flex">
                <Button
                  nativeButton={false}
                  render={
                    <Link href={`/edit-card/${selected.id}?unarchive=true`} />
                  }
                  variant="outline"
                  disabled={isDeleting}
                  className="flex-1 h-11 rounded-[14px]"
                >
                  Unarchive
                </Button>
                <Button
                  nativeButton={false}
                  render={
                    <Link href={`/my-foster-family/edit/${selected.id}`} />
                  }
                  variant="outline"
                  disabled={isDeleting}
                  className="flex-1 h-11 rounded-[14px]"
                >
                  Edit
                </Button>
                {canDeleteSelected && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isDeleting}
                    aria-busy={isDeleting}
                    className="flex-1 h-11 rounded-[14px]"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                )}
                <Button
                  type="button"
                  onClick={() => setSelected(null)}
                  disabled={isDeleting}
                  className="flex-1 h-11 rounded-[14px] bg-[#ee9266] hover:bg-[#df8358] text-white"
                >
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-input bg-white px-4 py-3">
      <p className="flex items-center gap-1.5 text-[13px] font-semibold leading-5">
        {icon}
        {label}
      </p>
      <p className="mt-1 truncate text-sm leading-6 text-[#6b6b6b]">
        {value || "Not added"}
      </p>
    </div>
  );
}

function formatRange(startDate: string, endDate: string) {
  if (!startDate && !endDate) return "";
  if (!startDate) return endDate;
  if (!endDate) return startDate;
  return `${startDate} - ${endDate}`;
}
