"use client";
import { Button } from "@/components/ui/button";
import { emptyFoster, type Foster } from "@/lib/fosters";
import { ArrowLeft, ArrowUpDown, Info, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { createPastFoster, deletePastFoster } from "./foster-actions";
import FormField from "./form-field";
import PastFosterPhotoUpload from "./past-foster-photo-upload";

type PastFosterDraft = Foster & { startDate: string; endDate: string };

export type RecentPastFoster = {
  id: string;
  name: string;
  image: string;
  startDate: string;
  endDate: string;
};

const emptyPastFoster: PastFosterDraft = {
  ...emptyFoster,
  status: "past",
  startDate: "",
  endDate: "",
};

export default function PastFosterForm({ recentPastFosters = [] }: { recentPastFosters?: RecentPastFoster[] }) {
  const [draft, setDraft] = useState<PastFosterDraft>(emptyPastFoster);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [oldestFirst, setOldestFirst] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const sortedPastFosters = [...recentPastFosters].sort((first, second) => {
    const dateDifference = Date.parse(first.startDate) - Date.parse(second.startDate);
    return oldestFirst ? dateDifference : -dateDifference;
  });

  function update(field: keyof PastFosterDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function validate(): string {
    if (!draft.name.trim()) return "Please enter your pet's name.";
    if (!draft.rescue.trim()) return "Please enter the rescue name.";
    if (!draft.startDate) return "Please select a start date.";
    if (!draft.endDate) return "Please select an end date.";
    if (draft.endDate < draft.startDate)
      return "End date can't be before the start date.";
    return "";
  }

  async function addPastFoster() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setPending(true);
    const result = await createPastFoster({
      ...draft,
      name: draft.name.trim(),
      rescue: draft.rescue.trim(),
      status: "past",
    });
    setPending(false);

    if ("error" in result) {
      setError(result.error);
      toast.error("Past foster was not saved", { description: result.error });
      return;
    }

    toast.success("Past foster added");
    setDraft(emptyPastFoster);
    router.push("/my-foster-family");
  }

  async function removePastFoster(id: string, name: string) {
    if (!window.confirm(`Remove ${name} from your past fosters?`)) return;

    setDeletingId(id);
    const result = await deletePastFoster(id);
    setDeletingId(null);

    if ("error" in result) {
      toast.error("Past foster was not removed", { description: result.error });
      return;
    }

    toast.success("Past foster removed");
    router.refresh();
  }

  return (
    <div className="max-w-[1239px] scroll-smooth">
      <Link
        href="/my-foster-family"
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#6F6B65] transition-colors hover:text-[#252525]"
      >
        <ArrowLeft className="size-4" />
        Back to My Foster Family
      </Link>

      <h1 className="text-xl md:text-2xl font-semibold md:font-bold leading-8 text-[#252525]">
        Add a Past Foster (Backfill)
      </h1>
      <p className="mt-1 text-sm text-[#9A9A9A] max-w-2xl">
        Fostered previously? Add them to complete your gallery. Each entry will
        appear in My Foster Family.
      </p>

      <div className="mt-6 rounded-[20px] border border-input bg-white p-5 sm:p-8 shadow-xs">
        <p className="text-base font-semibold text-[#252525]">Add new past foster</p>
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[360px_1fr] xl:grid-cols-[380px_1fr] items-start">
          <PastFosterPhotoUpload
            value={draft.image}
            onChange={(value) => update("image", value)}
            className="bg-white h-[340px] sm:h-[380px]"
          />
          <div className="w-full min-w-0 flex-1">
            <FormField
              label="Pet's name"
              placeholder="Enter pet's name"
              required
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={80}
            />
            <FormField
              className="mt-5"
              label="Rescue"
              placeholder="Enter Rescue name"
              required
              value={draft.rescue}
              onChange={(e) => update("rescue", e.target.value)}
              maxLength={120}
            />
            <FormField
              className="mt-5"
              label="Breed"
              placeholder="Enter breed"
              value={draft.breed}
              onChange={(e) => update("breed", e.target.value)}
              maxLength={80}
            />
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <FormField
                label="Age"
                placeholder="Enter age"
                value={draft.age}
                onChange={(e) => update("age", e.target.value)}
                maxLength={20}
              />
              <FormField
                label="Weight"
                placeholder="Enter weight"
                value={draft.weight}
                onChange={(e) => update("weight", e.target.value)}
                maxLength={20}
              />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
              <FormField
                placeholder=""
                label="Start date"
                type="date"
                required
                value={draft.startDate}
                onChange={(e) => update("startDate", e.target.value)}
              />
              <FormField
                placeholder=""
                label="End date"
                type="date"
                required
                value={draft.endDate}
                onChange={(e) => update("endDate", e.target.value)}
              />
            </div>

            <label className="mt-5 block">
              <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                About them
              </span>
              <textarea
                value={draft.about}
                onChange={(e) => update("about", e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Add memories or a couple sentences about your foster pet that show their personality!"
                className="mt-2 w-full resize-y rounded-2xl border border-input bg-white px-4 py-3.5 text-sm outline-none placeholder:text-[#bfbbb5] focus:ring-2 focus:ring-primary/30"
              />
            </label>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/60">
          <p className="flex items-center gap-2 text-[13px] text-[#9A9A9A]">
            <Info className="size-4 shrink-0 text-[#ee9266]" />
            Add as many past fosters as you like. They'll be listed below in
            chronological order.
          </p>
          <Button
            type="button"
            onClick={addPastFoster}
            disabled={pending}
            className="w-full sm:w-auto h-11 shrink-0 rounded-[12px] bg-[#ee9266] px-6 text-white hover:bg-[#df8358] shadow-[0_4px_8px_rgba(217,111,97,0.3)] touch-manipulation cursor-pointer"
          >
            <Plus className="size-4" /> {pending ? "Saving..." : "Add past foster"}
          </Button>
        </div>
      </div>

      <div className="mt-8 rounded-[20px] border border-input bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b pb-4">
          <p className="text-base font-semibold text-[#252525]">
            Past fosters added ({recentPastFosters.length})
          </p>
          <button
            type="button"
            onClick={() => setOldestFirst((current) => !current)}
            className="flex items-center gap-1.5 text-[13px] text-[#9A9A9A] hover:underline cursor-pointer"
          >
            <ArrowUpDown className="size-3.5" /> {oldestFirst ? "Oldest first" : "Newest first"}
          </button>
        </div>

        {sortedPastFosters.length === 0 ? (
          <p className="mt-4 text-sm text-[#9A9A9A] py-2">No past fosters added yet.</p>
        ) : (
          <div className="max-h-96 overflow-y-auto overscroll-contain">
            <ul className="divide-y divide-input">
              {sortedPastFosters.map((entry) => (
                <li key={entry.id} className="flex items-center gap-3 py-3 px-2">
                  {entry.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={entry.image} alt={entry.name} className="size-10 shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="size-10 shrink-0 rounded-full bg-[#f2f0ed]" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-5 truncate">{entry.name}</p>
                    <p className="text-[13px] text-[#9A9A9A]">
                      {formatPastFosterDate(entry.startDate)} - {formatPastFosterDate(entry.endDate)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePastFoster(entry.id, entry.name)}
                    aria-label={`Remove ${entry.name}`}
                    disabled={deletingId === entry.id}
                    className="p-2 text-[#9A9A9A] hover:text-destructive disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

function formatPastFosterDate(value: string) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
