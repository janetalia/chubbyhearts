"use client";

import Image from "next/image";
import { BadgeCheck, Sparkles, MapPin } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-6">
      {/* Profile Image with Camera Overlay */}
      <div className="relative group shrink-0">
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-rose-100 shadow-md">
          <Image
            src="/avatar/Image (Bella).svg"
            alt="JL Turner Profile"
            fill
            className="object-cover"
          />
        </div>

        <button
          type="button"
          className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg border-2 border-white hover:bg-rose-600 transition-colors cursor-pointer"
          title="Change Profile Photo"
        >
          <div className="relative w-4 h-4">
            <Image src="/icons/CameraIcon.svg" alt="Camera" fill className="object-contain invert brightness-0" />
          </div>
        </button>
      </div>

      {/* User Info */}
      <div className="space-y-2 text-center sm:text-left flex-1">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            JL Turner
          </h1>
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
            <BadgeCheck className="h-3.5 w-3.5" /> Verified Foster Parent
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-3">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Senior Foster Hero
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400" /> San Francisco, CA
          </span>
        </p>

        <p className="text-xs text-slate-400 font-mono">
          Member ID: <strong className="text-slate-700">CH-HERO-2233</strong>
        </p>
      </div>
    </div>
  );
}
