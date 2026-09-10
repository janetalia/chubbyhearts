"use client";

import Image from "next/image";
import { Plus, Heart, ShieldCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeBannerProps {
  onOpenQR?: () => void;
}

export default function WelcomeBanner({ onOpenQR }: WelcomeBannerProps) {
  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 p-6 sm:p-8 text-white shadow-xl shadow-rose-500/15 overflow-hidden">
      {/* Background Decorative Graphic */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none hidden sm:block">
        <Image
          src="/Vector.svg"
          alt="Decoration"
          fill
          className="object-cover object-right"
        />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold text-rose-100">
            <Heart className="h-3.5 w-3.5 fill-rose-200 text-rose-200" />
            <span>Active Foster Season 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, JL Turner! 🐾
          </h1>

          <p className="text-sm text-rose-100/90 leading-relaxed">
            You currently have <strong className="text-white font-bold">3 foster pets</strong> under your loving care. All medication and feeding logs are up to date for today.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold text-rose-100">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              <span>Certified Shelter Foster</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-amber-300" />
              <span>Next Vet Appt: Tomorrow, 10 AM</span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
          <Button
            onClick={onOpenQR}
            variant="secondary"
            className="h-11 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs px-5 shadow-md border-0 cursor-pointer"
          >
            <div className="relative w-4 h-4 mr-2">
              <Image src="/QRSquareIcon.svg" alt="QR Tag" fill className="object-contain" />
            </div>
            Scan Pet Tag
          </Button>

          <Button
            className="h-11 rounded-2xl bg-rose-900/30 hover:bg-rose-900/40 backdrop-blur-sm text-white border border-white/20 font-bold text-xs px-5 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Add Foster Pet
          </Button>
        </div>
      </div>
    </div>
  );
}
