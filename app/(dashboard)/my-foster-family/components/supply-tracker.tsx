"use client";

import { Package, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SupplyTracker() {
  const supplies = [
    {
      item: "Purina Pro Plan Adult Kibble (30 lb)",
      status: "65% Remaining",
      progress: 65,
      color: "bg-emerald-500",
      urgency: "Normal",
    },
    {
      item: "Heartworm Prevention Chewables",
      status: "2 Doses Left",
      progress: 25,
      color: "bg-amber-500",
      urgency: "Refill Soon",
    },
    {
      item: "Clumping Cat Litter (40 lb)",
      status: "80% Remaining",
      progress: 80,
      color: "bg-emerald-500",
      urgency: "Normal",
    },
    {
      item: "Puppy Training Pads (100 ct)",
      status: "10 Pads Left",
      progress: 10,
      color: "bg-rose-500",
      urgency: "Refill Urgent",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
            <Package className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Foster Supply Inventory</h3>
            <p className="text-xs text-slate-500 font-medium">
              Track pet food, meds, and care essentials
            </p>
          </div>
        </div>

        <Button size="sm" variant="outline" className="h-8 text-xs font-semibold rounded-xl cursor-pointer">
          <Plus className="h-3.5 w-3.5 mr-1 text-rose-500" />
          Request Supplies
        </Button>
      </div>

      <div className="space-y-4">
        {supplies.map((sup, idx) => (
          <div key={idx} className="space-y-1.5 p-3 rounded-xl bg-slate-50/60 border border-slate-100">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span className="flex items-center gap-2">
                {sup.item}
                {sup.urgency.includes("Urgent") && (
                  <span className="text-[10px] text-rose-600 bg-rose-100 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <AlertCircle className="h-2.5 w-2.5" /> Low Stock
                  </span>
                )}
              </span>
              <span className="text-slate-500">{sup.status}</span>
            </div>

            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${sup.color} transition-all duration-500`}
                style={{ width: `${sup.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
