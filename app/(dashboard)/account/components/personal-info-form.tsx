"use client";

import { User, Mail, Phone, Home, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PersonalInfoForm() {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Personal & Household Details</h3>
        <p className="text-xs text-slate-500 font-medium">
          Update your contact details and emergency foster address.
        </p>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-rose-500" /> Full Name
            </label>
            <Input
              defaultValue="JL Turner"
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-rose-500" /> Email Address
            </label>
            <Input
              defaultValue="hero@chubbyhearts.org"
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-rose-500" /> Phone Number
            </label>
            <Input
              defaultValue="+1 (555) 234-5678"
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="h-3.5 w-3.5 text-rose-500" /> Primary Address
            </label>
            <Input
              defaultValue="742 Evergreen Terrace, San Francisco, CA"
              className="h-11 rounded-xl bg-slate-50/50 border-slate-200"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            className="h-10 px-5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 cursor-pointer"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
