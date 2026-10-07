"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { Camera } from "lucide-react";

export default function PhotoUpload({
  value,
  onChange,
  compact = false,
  className = "",
  isEdit=false,
}: {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
  className?: string;
  isEdit?:boolean
}) {
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function upload(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 10 * 1024 * 1024) { setError("Choose a JPG, PNG or WebP image under 10 MB."); return; }
    setBusy(true); setError("");
    try {
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.round(bitmap.width * scale); canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Image processing unavailable");
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      onChange(canvas.toDataURL("image/jpeg", 0.8));
    } catch { setError("This image could not be opened. Please choose another."); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  }

  // Only fall back to a default height/background when the parent hasn't
  // specified their own height/bg via className — check for the "h-" and "bg-" prefixes.
  const hasHeightOverride = /(^|\s)h-/.test(className);
  const hasBgOverride = /(^|\s)bg-/.test(className);
  const defaultHeight = hasHeightOverride ? "" : (compact ? "h-[250px]" : "h-[312px]");
  const defaultBg = hasBgOverride ? "" : (compact ? "bg-white" : "bg-[#edeac8]");

  return <div className="relative">
    {/* {isEdit?<Image src='/Vector.svg' alt='vector image' height={200} width={200} className="absolute top-0 right-0 size-44 z-10" />:''} */}
    
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Upload pet photo" className="sr-only" onChange={event => void upload(event.target.files?.[0])} />
    <button
      type="button"
      disabled={busy}
      onClick={() => input.current?.click()}
      className={`relative flex w-full flex-col items-center justify-center overflow-hidden rounded-[24px] border-2 border-dashed border-[#e9e5de] ${defaultHeight} ${defaultBg} ${className}`}
    >
      {value ? <> 
      <Image
        src={value}
        alt="Pet photo"
        fill
        unoptimized
        sizes="(max-width: 767px) 60vw, 601px"
        className="object-cover"
      />
    <span className="absolute bottom-4 left-3 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs">
      <Camera className="size-3" />Change photo</span></> : <><span className="flex size-14 items-center justify-center rounded-full bg-white shadow-sm"><Camera className="size-5.5" /></span><span className="mt-3 text-sm font-semibold">{busy ? "Uploading..." : compact ? "Upload photo" : "Add photo"}</span><span className="text-xs leading-5 text-muted-foreground">{compact ? "JPG, PNG · Max 10MB" : "Tap to upload"}</span></>}
    </button>
    {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    
  </div>;
}