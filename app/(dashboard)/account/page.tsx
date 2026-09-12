"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, Calendar, Check, Mail, MapPin } from "lucide-react";
import Image from "next/image";
import FormField from "../components/form-field";
import PageHeading from "../components/page-heading";

export default function AccountPage() {
  return (
    <div className="max-w-309.75">
      <PageHeading
  title="Account"
  action={
    <Button className="hidden h-13.25 rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358] md:block">
      Save Changes
    </Button>
  }
/>

      <div className="mt-5 md:mt-[29px] grid gap-6 lg:grid-cols-[395px_1fr]">
        <Card className="rounded-[16px] border-[#ede9e4] p-8 text-center shadow">
          <div className="mx-auto h-[156px] w-[156px] overflow-hidden rounded-full border border-[#ede9e4] bg-[#f9f5eb]">
            <Image src="/avatar/Image (Bella).svg" alt="JL Turner" width={156} height={156} className="h-full w-full object-cover" />
          </div>
          <h2 className="mt-4 text-[32px] font-semibold text-[#1a1a1a]">JL Turner</h2>
          {/* <p className="text-sm font-semibold text-[#e05a3a]">Foster caregiver</p> */}
          <div className="mt-4 space-y-3 text-left text-sm text-[#6f6b65]">
            <p className="flex items-center gap-3"><Mail className="h-4 w-4" /> jlturner@example.com</p>
            <p className="flex items-center gap-3"><Calendar className="h-4 w-4" /> Member since 2023</p>
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[16px] border-[#ede9e4] p-6 shadow">
            <h2 className="text-base font-semibold text-[#252525]">Personal information</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-x-6">
              <FormField label="First name" placeholder="JL" />
              <FormField label="Last name" placeholder="Turner" />
              <FormField label="Email" placeholder="jlturner@example.com" />
              <FormField label="Phone" placeholder="(555) 219-8044" />
            </div>
          </Card>

          <Card className="rounded-[16px] border-[#ede9e4] p-6 shadow">
            <h2 className="flex items-center gap-2 text-base font-semibold text-[#252525]">
              <Bell className="h-4 w-4" />
              Notifications
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {["New adoption interest", "Rescue updates", "Card scan activity", "Weekly summary"].map((item) => (
                <label key={item} className="flex h-[51px] items-center justify-between rounded-[16px] border border-[#e9e5de] px-4 text-sm font-medium text-[#252525]">
                  {item}
<div className="relative h-4 w-4">
  <input
    type="checkbox"
    defaultChecked
    className="peer h-4 w-4 appearance-none rounded border border-gray-300 bg-white checked:border-[#ee9266] checked:bg-[#ee9266]"
  />
  <Check className="pointer-events-none absolute inset-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
</div>
                </label>
              ))}
            </div>
          </Card>
        </div>

              <div className="flex justify-end md:hidden">
  <Button className="h-13.25 w-full rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]">
    Save Changes
  </Button>
</div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs leading-4 text-[#9a9a9a]">
        <MapPin className="h-4 w-4" />
        <span>Tap a card behind to bring it to front</span>
      </div>


    </div>
  );
}
