"use client";

import Image from "next/image";

export default function AuthHeroIllustration() {
  return (
    <div className="relative flex-1 hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-rose-50 via-pink-50/50 to-orange-50/40 border-l border-rose-100/60 overflow-hidden">
      {/* Decorative Blob */}
      <div className="absolute top-10 right-10 opacity-30 pointer-events-none">
        <Image
          src="/Vector.svg"
          alt="Decoration"
          width={180}
          height={180}
          priority
        />
      </div>

      <div className="relative max-w-lg w-full flex flex-col items-center text-center space-y-6 z-10">
        {/* Main Hero Illustration */}
        <div className="relative w-full aspect-square max-w-[340px] drop-shadow-xl transition-transform hover:scale-[1.02] duration-300">
          <Image
            src="/logo/Frame 2147235267.svg"
            alt="Chubby Hearts Foster Family"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Feature Highlights */}
        <div className="space-y-3 pt-2">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Nurturing Foster Families with Love 🐾
          </h2>
          <p className="text-slate-600 text-sm max-w-md leading-relaxed">
            Track pet health logs, manage foster care schedules, and stay connected with your rescue organization all in one place.
          </p>
        </div>

        {/* Avatar Showcase */}
        <div className="pt-4 flex flex-col items-center space-y-2">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
            Trusted by 500+ Foster Caregivers
          </p>
          <div className="relative h-12 w-48 overflow-hidden rounded-full border border-rose-200/50 bg-white/70 backdrop-blur-xs p-1 shadow-xs">
            <Image
              src="/avatar/all-avatar.png"
              alt="Foster Caregivers Community"
              fill
              className="object-cover rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
