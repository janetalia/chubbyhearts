"use client";

import Image from "next/image";
import { Utensils, Syringe, Stethoscope } from "lucide-react";

export default function ActivityFeed() {
  const activities = [
    {
      id: "act-1",
      petName: "Buddy",
      petAvatar: "/pets/Image (Buddy) (7).svg",
      type: "Feeding Logged",
      desc: "Morning kibble (1.5 cups) + joint supplement",
      time: "8:30 AM Today",
      icon: Utensils,
      iconBg: "bg-rose-50 text-rose-600 border-rose-100",
    },
    {
      id: "act-2",
      petName: "Charlie",
      petAvatar: "/pets/Image (Charlie).svg",
      type: "Medication Administered",
      desc: "Antibiotic tablet 50mg after breakfast",
      time: "9:00 AM Today",
      icon: Syringe,
      iconBg: "bg-amber-50 text-amber-600 border-amber-100",
    },
    {
      id: "act-3",
      petName: "Luna",
      petAvatar: "/pets/Image (Luna).svg",
      type: "Vet Checkup Completed",
      desc: "Annual booster vaccines & microchip scan passed",
      time: "Yesterday, 2:15 PM",
      icon: Stethoscope,
      iconBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Recent Care Activity</h3>
          <p className="text-xs text-slate-500 font-medium">
            Daily feeding, medical, and wellness timeline
          </p>
        </div>
        <button className="text-xs font-bold text-rose-500 hover:underline cursor-pointer">
          View All Logs
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((act) => {
          const Icon = act.icon;
          return (
            <div
              key={act.id}
              className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors border border-slate-100/80"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-rose-200">
                <Image src={act.petAvatar} alt={act.petName} fill className="object-cover" />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">
                    {act.petName} — {act.type}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">{act.time}</span>
                </div>
                <p className="text-xs text-slate-600 truncate">{act.desc}</p>
              </div>

              <div className={`p-2 rounded-xl border ${act.iconBg} shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
