"use client";

import { Dog, Pill, CalendarCheck, Award } from "lucide-react";

export default function StatsSummary() {
  const stats = [
    {
      title: "Active Fosters",
      value: "3 Pets",
      subtitle: "Buddy, Luna & Charlie",
      icon: Dog,
      color: "bg-rose-500",
      bgLight: "bg-rose-50 border-rose-100",
      textColor: "text-rose-600",
    },
    {
      title: "Medication Scheduled",
      value: "1 Pending",
      subtitle: "Buddy - Heartworm Prevention",
      icon: Pill,
      color: "bg-amber-500",
      bgLight: "bg-amber-50 border-amber-100",
      textColor: "text-amber-600",
    },
    {
      title: "Days Fostered",
      value: "142 Days",
      subtitle: "12 Total Rescues Helped",
      icon: CalendarCheck,
      color: "bg-emerald-500",
      bgLight: "bg-emerald-50 border-emerald-100",
      textColor: "text-emerald-600",
    },
    {
      title: "Shelter Status",
      value: "Gold Partner",
      subtitle: "Chubby Hearts Rescue",
      icon: Award,
      color: "bg-blue-500",
      bgLight: "bg-blue-50 border-blue-100",
      textColor: "text-blue-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="flex items-center justify-between p-5 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                {stat.title}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{stat.value}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{stat.subtitle}</p>
            </div>
            <div className={`p-3 rounded-2xl ${stat.bgLight} border flex items-center justify-center`}>
              <Icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
