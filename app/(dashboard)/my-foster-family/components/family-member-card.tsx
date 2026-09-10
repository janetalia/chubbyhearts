"use client";

import Image from "next/image";
import { UserCheck, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FamilyMemberCard() {
  const familyMembers = [
    {
      name: "JL Turner",
      role: "Primary Foster Parent",
      email: "jlturner@chubbyhearts.org",
      phone: "+1 (555) 234-5678",
      avatar: "/avatar/Image (Bella).svg",
      assignedPets: "Buddy, Luna",
      badge: "Primary Admin",
    },
    {
      name: "Samantha Turner",
      role: "Co-Foster Caregiver",
      email: "samantha@chubbyhearts.org",
      phone: "+1 (555) 876-5432",
      avatar: "/avatar/Image (Lana).svg",
      assignedPets: "Charlie",
      badge: "Authorized Caregiver",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Household Care Team</h3>
        <span className="text-xs font-semibold text-slate-500">
          2 Registered Caregivers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {familyMembers.map((member, idx) => (
          <Card key={idx} className="rounded-[16px] border-slate-100 bg-white shadow-xs p-4">
            <CardContent className="p-0 flex items-start gap-4">
              <div className="relative h-12 w-12 rounded-full overflow-hidden shrink-0 border-2 border-rose-200">
                <Image src={member.avatar} alt={member.name} fill className="object-cover" />
              </div>

              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {member.name}
                  </h4>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-100">
                    {member.badge}
                  </span>
                </div>

                <p className="text-xs font-medium text-slate-500">{member.role}</p>

                <div className="pt-2 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-rose-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="h-3 w-3 text-emerald-500" />
                    <span>Assigned Fosters: {member.assignedPets}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
