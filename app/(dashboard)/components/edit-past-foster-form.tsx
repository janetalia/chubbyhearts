"use client";
import { Button } from "@/components/ui/button";
import type { Foster } from "@/lib/foster-schema";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateFoster } from "./foster-actions";
import FormField from "./form-field";
import PastFosterPhotoUpload from "./past-foster-photo-upload";

type PastFosterDraft = Foster & { startDate: string; endDate: string };

export default function EditPastFosterForm({ foster }: { foster: PastFosterDraft }) {
  const [draft, setDraft] = useState<PastFosterDraft>(foster);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
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

  async function saveChanges(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = validate();
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setPending(true);

    // updateFoster handles both ACTIVE and PAST fosters.
    const result = await updateFoster(foster.id, {
      ...draft,
      name: draft.name.trim(),
      rescue: draft.rescue.trim(),
    });

    setPending(false);

    if ("error" in result) {
      setError(result.error);
      toast.error("Past foster was not saved", { description: result.error });
      return;
    }

    toast.success("Past foster updated");
    router.push("/my-foster-family");
    router.refresh();
  }

  return (
    <form onSubmit={saveChanges} className="max-w-[1239px] scroll-smooth">
      <Link
        href="/my-foster-family"
        className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-[#6F6B65] transition-colors hover:text-[#252525]"
      >
        <ArrowLeft className="size-4" />
        Back to My Foster Family
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold md:font-bold leading-8 text-[#252525]">
            Edit Past Foster
          </h1>
          <p className="mt-1 text-sm text-[#9A9A9A]">
            Update details and memories for {draft.name || "this pet"}.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/my-foster-family")}
            className="h-11 rounded-[12px] border-input px-5 text-[#252525] hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="h-11 rounded-[12px] bg-[#ee9266] px-6 text-white hover:bg-[#df8358] shadow-[0_4px_8px_rgba(217,111,97,0.3)]"
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-6 rounded-[20px] border border-input bg-white p-5 sm:p-8 shadow-xs">
        <p className="text-base font-semibold text-[#252525]">Pet details</p>
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

        <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-6 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/my-foster-family")}
            className="w-full sm:w-auto h-11 rounded-[12px] border-input px-6 text-[#252525] hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={pending}
            className="w-full sm:w-auto h-11 rounded-[12px] bg-[#ee9266] px-7 text-white hover:bg-[#df8358] shadow-[0_4px_8px_rgba(217,111,97,0.3)]"
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
