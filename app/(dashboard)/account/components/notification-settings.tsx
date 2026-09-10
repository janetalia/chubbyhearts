"use client";

import { useState } from "react";
import { Bell, Pill, Utensils, HeartHandshake, Smartphone } from "lucide-react";

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState({
    medication: true,
    feeding: true,
    adoption: true,
    sms: false,
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const settingsList = [
    {
      key: "medication" as const,
      label: "Medication & Vet Alerts",
      desc: "Receive urgent reminders for scheduled vaccinations & pet meds",
      icon: Pill,
    },
    {
      key: "feeding" as const,
      label: "Feeding Schedule Reminders",
      desc: "Daily morning & evening feeding prompts for active fosters",
      icon: Utensils,
    },
    {
      key: "adoption" as const,
      label: "Adoption Inquiries & Updates",
      desc: "Get notified when potential adopters apply for your foster pets",
      icon: HeartHandshake,
    },
    {
      key: "sms" as const,
      label: "SMS Emergency Broadcasts",
      desc: "Receive urgent rescue broadcasts via text message",
      icon: Smartphone,
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900">Notification Preferences</h3>
          <p className="text-xs text-slate-500 font-medium">
            Manage alerts for foster pet care and adoption news
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {settingsList.map((item) => {
          const Icon = item.icon;
          const isEnabled = prefs[item.key];
          return (
            <div
              key={item.key}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/60 border border-slate-100 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white border border-slate-200 text-rose-500">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900">{item.label}</h4>
                  <p className="text-[11px] text-slate-500">{item.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggle(item.key)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  isEnabled ? "bg-rose-500" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
