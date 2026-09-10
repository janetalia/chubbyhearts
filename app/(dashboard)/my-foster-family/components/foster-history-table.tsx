"use client";

import Image from "next/image";
import { CheckCircle2, Heart } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function FosterHistoryTable() {
  const alumni = [
    {
      name: "Bella",
      type: "Cat (Tabby)",
      fosterDuration: "45 Days",
      adoptedDate: "Jan 14, 2026",
      adopter: "The Henderson Family",
      status: "Adopted Forever Home",
      avatar: "/avatar/Image (Bella).svg",
    },
    {
      name: "Lana",
      type: "Puppy (Labrador)",
      fosterDuration: "60 Days",
      adoptedDate: "Feb 02, 2026",
      adopter: "Marcus & Chloe",
      status: "Adopted Forever Home",
      avatar: "/avatar/Image (Lana).svg",
    },
    {
      name: "Max",
      type: "Beagle Mix",
      fosterDuration: "30 Days",
      adoptedDate: "Aug 19, 2025",
      adopter: "David Miller",
      status: "Adopted Forever Home",
      avatar: "/pets/Image (Buddy) (7).svg",
    },
  ];

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
            Foster Alumni Success Stories
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Pets fostered by your household who found their happy forever home
          </p>
        </div>
        <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          14 Successful Adoptions
        </span>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700">Pet Name</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Type / Breed</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Foster Time</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Adoption Date</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Forever Family</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alumni.map((pet, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50/60">
                <TableCell className="font-bold text-slate-900">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border border-rose-200 shrink-0">
                      <Image src={pet.avatar} alt={pet.name} fill className="object-cover" />
                    </div>
                    <span>{pet.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-600">
                  {pet.type}
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-700">
                  {pet.fosterDuration}
                </TableCell>
                <TableCell className="text-xs font-medium text-slate-500">
                  {pet.adoptedDate}
                </TableCell>
                <TableCell className="text-xs font-semibold text-slate-800">
                  {pet.adopter}
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    <CheckCircle2 className="h-3 w-3" /> {pet.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
