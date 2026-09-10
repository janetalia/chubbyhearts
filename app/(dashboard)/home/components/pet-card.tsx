"use client";

import Image from "next/image";
import { QrCode, FileText, Heart, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export interface PetData {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  status: "Active Foster" | "Medical Hold" | "Ready for Adoption";
  imageSrc: string;
  tagId: string;
  lastFed: string;
}

interface PetCardProps {
  pet: PetData;
  onOpenQR: (petName: string, tagId: string) => void;
}

export default function PetCard({ pet, onOpenQR }: PetCardProps) {
  const getStatusBadge = (status: PetData["status"]) => {
    switch (status) {
      case "Active Foster":
        return "bg-emerald-50 text-emerald-600 border-emerald-200";
      case "Medical Hold":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "Ready for Adoption":
        return "bg-rose-50 text-rose-600 border-rose-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <Card className="overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm hover:shadow-lg transition-all duration-300 group">
      {/* Pet Image Header */}
      <div className="relative w-full h-52 bg-rose-50 overflow-hidden">
        <Image
          src={pet.imageSrc}
          alt={pet.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-xs backdrop-blur-md ${getStatusBadge(
              pet.status
            )}`}
          >
            {pet.status}
          </span>
        </div>

        <button
          onClick={() => onOpenQR(pet.name, pet.tagId)}
          className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-rose-500 hover:text-white shadow-md transition-colors cursor-pointer"
          title="Scan Pet QR Code"
        >
          <QrCode className="h-4 w-4" />
        </button>
      </div>

      {/* Card Body */}
      <CardContent className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-500 transition-colors">
              {pet.name}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {pet.breed} • {pet.age}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Weight
            </span>
            <span className="text-sm font-bold text-slate-800">{pet.weight}</span>
          </div>
        </div>

        {/* Pet Meta Info */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
            <Activity className="h-3.5 w-3.5 text-rose-500" />
            <span>Fed: {pet.lastFed}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-xl">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Tag: {pet.tagId}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Button
            onClick={() => onOpenQR(pet.name, pet.tagId)}
            variant="outline"
            size="sm"
            className="h-9 rounded-xl border-slate-200 text-xs font-semibold hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5 mr-1.5" />
            Show QR Tag
          </Button>

          <Button
            size="sm"
            className="h-9 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer shadow-xs"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Health Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
