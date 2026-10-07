"use client";
import { Button } from "@/components/ui/button";
import type { Foster } from "@/lib/foster-schema";
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
    <form onSubmit={saveChanges} className="max-w-[1239px]">
      <h1 className="text-xl md:text-2xl font-semibold md:font-bold leading-8">
        Edit Past Foster
      </h1>
      
      <div className="mt-5 rounded-[16px] border border-input bg-white p-6 shadow">
        <p className="text-base font-semibold">Pet details</p>
        <div className="mt-4 grid gap-6 lg:flex items-start">
          <PastFosterPhotoUpload
            value={draft.image}
            onChange={(value) => update("image", value)}
            className="bg-white md:w-95"
          />
          <div className="flex-1">
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
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
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
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
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

        <div className="mt-5 flex justify-end">
          <Button
            type="submit"
            disabled={pending}
            className="w-full sm:w-fit h-11 shrink-0 rounded-[12px] bg-[#ee9266] px-5 text-white hover:bg-[#df8358] shadow-[0_4px_8px_rgba(217,111,97,0.3)]"
          >
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
