"use client";
import { Button } from "@/components/ui/button";
import { emptyFoster, saveFoster, type Foster } from "@/lib/fosters";
import { ArrowUpDown, Info, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormField from "./form-field";
import PastFosterPhotoUpload from "./past-foster-photo-upload";

type PastFosterDraft = Foster & { startDate: string; endDate: string };

const emptyPastFoster: PastFosterDraft = {
  ...emptyFoster,
  status: "past",
  startDate: "",
  endDate: "",
};

const saveData = [
  {
    id: "1",
    image: "/pets/image (Buddy) (7).svg",
    name: "Buddy",
    startDate: "Jan 10, 2023",
    endDate: "Apr 15, 2023",
  },
  {
    id: "2",
    image: "/pets/image (Charlie).svg",
    name: "Luna",
    startDate: "May 20, 2023",
    endDate: "Aug 5, 2023",
  },
  {
    id: "3",
    image: "/pets/image (Luna).svg",
    name: "Charlie",
    startDate: "Sep 12, 2023",
    endDate: "Dec 2, 2023",
  },
];

export default function PastFosterForm() {
  const [draft, setDraft] = useState<PastFosterDraft>(emptyPastFoster);
  const [saved, setSaved] = useState(saveData);
  const [error, setError] = useState("");
  const [oldestFirst, setOldestFirst] = useState(true);
  const router = useRouter();

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

  function addAnother() {
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setSaved((current) => [
      ...current,
      {
        ...draft,
        name: draft.name.trim(),
        rescue: draft.rescue.trim(),
        id: crypto.randomUUID(),
      },
    ]);
    setDraft(emptyPastFoster);
  }

  function removeEntry(id: string) {
    setSaved((current) => current.filter((entry) => entry.id !== id));
  }

  function toggleSort() {
    setOldestFirst((current) => !current);
    setSaved((current) => [...current].reverse());
  }

  return (
    <div className="max-w-[1239px]">
      <h1 className="text-xl md:text-2xl font-semibold md:font-bold leading-8">
        Add a Past Foster (Backfill)
      </h1>
      <p className="mt-1 text-sm text-[#9A9A9A] md:w-2/5">
        Fostered previously? Add them to complete your gallery. Each entry will
        appear in My Foster Family.
      </p>

      <div className="mt-5 rounded-[16px] border border-input bg-white p-6 shadow">
        <p className="text-base font-semibold">Add new past foster</p>
        <div className="mt-4 grid gap-6 lg:flex items-start">
          <PastFosterPhotoUpload
            value={draft.image}
            onChange={(value) => update("image", value)}
            className="bg-white md:w-95"
          />
          <div className="flex-1">
            <FormField
              className="col-span-2"
              label="Pet's name"
              placeholder="Enter pet's name"
              required
              value={draft.name}
              onChange={(e) => update("name", e.target.value)}
              maxLength={80}
            />
            <FormField
              className="col-span-2"
              label="Rescue"
              placeholder="Enter Rescue name"
              required
              value={draft.rescue}
              onChange={(e) => update("rescue", e.target.value)}
              maxLength={120}
            />
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
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
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="mt-5 flex flex-col-reverse items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="hidden sm:flex items-center gap-2 text-[13px] text-[#9A9A9A]">
            <Info className="size-4 shrink-0" />
            Add as many past fosters as you like. They'll be listed below in
            chronological order.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={addAnother}
            className="w-full sm:w-fit h-[44px] shrink-0 rounded-[12px] border-[#D96F61] px-5 text-[#D96F61] hover:bg-[#D96F61]/5 hover:text-[#D96F61]"
          >
            <Plus className="size-4" /> Add another
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-[16px] border border-input bg-white pt-6 shadow">
        <div className="flex items-center justify-between border-b px-6 pb-6">
          <p className="text-base font-semibold">
            Past fosters added ({saved.length})
          </p>
          <button
            type="button"
            onClick={toggleSort}
            className="flex items-center gap-1.5 text-[13px] text-[#9A9A9A] hover:underline"
          >
            <ArrowUpDown className="size-3.5" />{" "}
            {oldestFirst ? "Oldest first" : "Newest first"}
          </button>
        </div>

        {saved.length === 0 ? (
          <p className="mt-4 text-sm text-[#9A9A9A]">
            No past fosters added yet.
          </p>
        ) : (
          <ul className="divide-y divide-input">
            {saved.map((entry) => (
              <li key={entry.id} className="flex items-center gap-3 py-3 px-6">
                {entry.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.image}
                    alt={entry.name}
                    className="size-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-10 shrink-0 rounded-full bg-[#f2f0ed]" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-5">
                    {entry.name}
                  </p>
                  <p className="text-[13px] text-[#9A9A9A]">
                    {entry.startDate} – {entry.endDate}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Remove ${entry.name}`}
                  className="p-2 text-[#9A9A9A] hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
