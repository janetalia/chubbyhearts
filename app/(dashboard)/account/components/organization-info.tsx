"use client";

import Image from "next/image";
import { Building2, ShieldCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OrganizationInfo() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Rescue Shelter Affiliation</h3>
            <p className="text-xs text-slate-500 font-medium">
              Connected rescue organization & foster program license
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
          <ShieldCheck className="h-3.5 w-3.5" /> Certified Partner
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="relative h-12 w-36">
            <Image
              src="/logo/Frame 2147235265.svg"
              alt="Chubby Hearts Rescue"
              fill
              className="object-contain"
            />
          </div>
          <div className="hidden md:block h-8 w-px bg-slate-200" />
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-slate-900">
              Chubby Hearts Animal Rescue Org
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Licence #501(c)(3) — Shelter ID: CH-ORG-88402
            </p>
          </div>
        </div>

        <Button variant="outline" size="sm" className="h-9 rounded-xl border-slate-200 text-xs font-semibold shrink-0 cursor-pointer">
          <span>Org Portal</span>
          <ExternalLink className="h-3.5 w-3.5 ml-1 text-rose-500" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 space-y-1">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Foster Coordinator
          </span>
          <p className="font-bold text-slate-800">Sarah Jenkins (sarah@chubbyhearts.org)</p>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-100 space-y-1">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
            Emergency Shelter Hotline
          </span>
          <p className="font-bold text-rose-600">+1 (800) 555-HEARTS</p>
        </div>
      </div>
    </div>
  );
}
