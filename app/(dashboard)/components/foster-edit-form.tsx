"use client";
import { Button } from "@/components/ui/button";
import { emptyFoster, type Foster } from "@/lib/fosters";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { updateFoster } from "./foster-actions";
import FormField from "./form-field";
import PhotoUpload from "./photo-upload";

export default function FosterEditForm({ foster }: { foster?: Foster }) {
  const [draft, setDraft] = useState<Foster>(foster ?? emptyFoster);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();
  function update(field: keyof Foster, value: string) { setDraft(current => ({ ...current, [field]: value })); }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.name.trim()) { setError("Please enter your pet's name."); return; }
    if (draft.adoptionLink && !/^https?:\/\//i.test(draft.adoptionLink)) { setError("Use an adoption link starting with https:// or http://."); return; }
    if (!foster?.id) { setError("Foster card not found."); return; }
    setPending(true);
    setError("");
    const result = await updateFoster(foster.id, { ...draft, name: draft.name.trim() });
    setPending(false);

    if ("error" in result) {
      setError(result.error);
      toast.error("Card was not saved", { description: result.error });
      return;
    }

    toast.success("Foster card updated");
    router.push(result.redirectTo);
    router.refresh();
  }
  return <form onSubmit={submit} className="max-w-309.75">
    <div className="flex min-h-13.25 items-center justify-between gap-3">
      <h1 className="text-xl font-semibold leading-8">{foster ? "Edit Card" : "Create a Card"}</h1>
      <Button type="submit" disabled={pending} className="hidden h-13.25 rounded-[16px] px-8.5 shadow-[0_4px_8px_rgba(217,111,97,0.3)] md:inline-flex">{pending ? "Saving..." : foster ? "Save Changes" : "Save Card"}</Button>
    </div>
    {/* main form */}
    <div className={`mt-5 ${foster ? "grid gap-6 lg:grid-cols-2" : ""}`}>
      <div className="">
        <p className="mb-2 text-base font-semibold">Pet photo</p>
        <PhotoUpload isEdit={true} value={draft.image} onChange={value => update("image", value)} className="h-[450px] bg-[#faf7ef] justify-end" />
        </div>
      <div>
        <div className={`grid gap-x-6 gap-y-5 ${foster ? "mt-0 sm:grid-cols-2" : "mt-5 md:grid-cols-2"}`}>
          <FormField label="Pet's name" placeholder="e.g. Biscuit" required value={draft.name} onChange={e => update("name", e.target.value)} maxLength={80} />
          <FormField label="Rescue name" placeholder="e.g. Happy Tails Rescue" value={draft.rescue} onChange={e => update("rescue", e.target.value)} maxLength={120} />
          <FormField label="Age" placeholder="e.g. 2 years" value={draft.age} onChange={e => update("age", e.target.value)} maxLength={40} />
          <FormField label="Weight" placeholder="e.g. 52 lbs" value={draft.weight} onChange={e => update("weight", e.target.value)} maxLength={40} />
          <FormField label="Breed" placeholder="e.g. Golden Retriever Mix" value={draft.breed} onChange={e => update("breed", e.target.value)} maxLength={80} />
          <FormField label="Adoption application link" placeholder="Link to an adoption application or the rescue's site" type="url" value={draft.adoptionLink} onChange={e => update("adoptionLink", e.target.value)} maxLength={300} />
        </div>
        <label className="mt-5 block"><span className="text-[13px] font-semibold leading-5">About them</span><textarea value={draft.about} onChange={e => update("about", e.target.value)} maxLength={500} placeholder="Add a couple sentences about your foster pet that show their true personality!" className="mt-2 h-[114px] w-full resize-y rounded-2xl border border-input bg-white px-4 py-3.5 text-sm outline-none placeholder:text-[#bfbbb5] focus:ring-2 focus:ring-primary/30" /></label>
      </div>
    </div>
    {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}
    <div className="mt-4 flex flex-col gap-3 md:flex-row">
      <Button type="submit" disabled={pending} className="h-13.25 rounded-2xl shadow-[0_4px_8px_rgba(217,111,97,0.3)] md:hidden">{pending ? "Saving..." : foster ? "Save Changes" : "Save Card"}</Button>
    </div>
      <div className="py-3 text-center text-[12px] text-[#9A9A9A] hover:underline flex items-center gap-2 justify-center"> <MapPin className="size-4"/> <span>Tap a card behind to bring it to front</span></div>
  </form>;
}
