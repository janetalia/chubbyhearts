"use client";
import { useSyncExternalStore } from "react";
import { z } from "zod";

export const fosterSchema = z.object({
  id: z.string(), name: z.string(), rescue: z.string(), image: z.string(),
  age: z.string().default(""), weight: z.string().default(""), breed: z.string().default(""),
  about: z.string().default(""), adoptionLink: z.string().default(""),
  status: z.enum(["active", "past"]), startDate: z.string().default(""), endDate: z.string().default(""),
});
export type Foster = z.infer<typeof fosterSchema>;
export const emptyFoster: Foster = { id: "", name: "", rescue: "", image: "", age: "", weight: "", breed: "", about: "", adoptionLink: "", status: "active", startDate: "", endDate: "" };
const galleryImages = ["Image (Buddy).svg", "Container.svg", "Container (1).svg", "Image (Buddy) (1).svg", "Image (Buddy) (2).svg", "Image (Buddy) (3).svg", "Image (Buddy) (4).svg", "Image (Buddy) (5).svg", "Image (Buddy) (6).svg", "Image (Buddy) (8).svg"];
export const initialFosters: Foster[] = [
  { ...emptyFoster, id: "max", name: "Max", rescue: "Happy Paws Rescue", image: "/avatar/Image (Lana).svg" },
  { ...emptyFoster, id: "bella", name: "Bella", rescue: "Happy Paws Rescue", image: "/avatar/Image (Bella).svg" },
  ...galleryImages.map((image, i) => ({ ...emptyFoster, id: `family-${i}`, name: ["Buddy", "Daisy", "Candy", "Coco"][i] || "Buddy", rescue: "Hope Paws Rescue", image: `/avatar/${image}`, status: "past" as const })),
  // ...["Buddy", "Luna", "Charlie"].map((name, i) => ({ ...emptyFoster, id: `history-${i}`, name, rescue: "Hope Paws Rescue", image: `/pets/${name === "Buddy" ? "Image (Buddy) (7)" : `Image (${name})`}.svg`, status: "past" as const, startDate: ["2023-01-10", "2023-05-20", "2023-09-12"][i], endDate: ["2023-04-15", "2023-08-05", "2023-12-02"][i] })),
];
const key = "chubby-hearts-fosters-v1";
let cachedRaw: string | null | undefined;
let cached = initialFosters;
const listeners = new Set<() => void>();
function snapshot() {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== cachedRaw) {
      cachedRaw = raw;
      const parsed = raw ? z.array(fosterSchema).safeParse(JSON.parse(raw)) : null;
      cached = parsed?.success ? parsed.data : initialFosters;
    }
  } catch { /* Keep the last usable state if browser storage is unavailable. */ }
  return cached;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
export function useFosters() {
  return useSyncExternalStore(subscribe, snapshot, () => initialFosters);
}
function persist(fosters: Foster[]) {
  localStorage.setItem(key, JSON.stringify(fosters));
  cachedRaw = undefined;
  listeners.forEach(listener => listener());
}
export function saveFoster(foster: Foster) {
  const current = snapshot();
  persist(current.some(item => item.id === foster.id) ? current.map(item => item.id === foster.id ? foster : item) : [...current, foster]);
}
export function deleteFoster(id: string) { persist(snapshot().filter(item => item.id !== id)); }
export function shareUrl(foster: Foster) {
  // Uploaded photos remain on this device until an image-hosting backend is connected.
  const shareable = { ...foster, image: foster.image.startsWith("/avatar/") || foster.image.startsWith("/pets/") ? foster.image : "" };
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/pet-card#${encodeURIComponent(JSON.stringify(shareable))}`;
}
