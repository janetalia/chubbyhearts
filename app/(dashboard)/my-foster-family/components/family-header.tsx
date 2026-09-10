"use client";

import Image from "next/image";
import { PhoneCall, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FamilyHeader() {
  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl ring-4 ring-rose-100 shrink-0">
            <Image
              src="/avatar/Image (Bella).svg"
              alt="JL Turner Household"
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900">
                The Turner Foster Household
              </h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-100">
                <ShieldCheck className="h-3.5 w-3.5" /> Certified
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
              <span>Primary Caregiver: JL Turner</span>
              <span>•</span>
              <span>Shelter Partner: Chubby Hearts Rescue</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="h-10 rounded-xl border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Mail className="h-4 w-4 mr-2 text-rose-500" />
            Message Coordinator
          </Button>

          <Button className="h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 cursor-pointer">
            <PhoneCall className="h-4 w-4 mr-2" />
            Rescue Hotline
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Fosters
          </span>
          <p className="text-lg font-bold text-slate-800">3 Pets</p>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Total Alumni Fostered
          </span>
          <p className="text-lg font-bold text-rose-500">14 Pets</p>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Rescue Coordinator
          </span>
          <p className="text-sm font-bold text-slate-800">Sarah Jenkins</p>
        </div>
        <div className="space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Emergency Vet
          </span>
          <p className="text-sm font-bold text-slate-800">Central Vet Hospital</p>
        </div>
      </div>
    </div>
  );
}
