"use client";

import Image from "next/image";
import { Copy, Share2, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  petName?: string;
  petTagId?: string;
}

export default function QRModal({
  open,
  onOpenChange,
  petName = "Buddy",
  petTagId = "CH-88294-PET",
}: QRModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 border-slate-100 bg-white">
        <DialogHeader className="text-center sm:text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 border border-rose-100">
            <div className="relative w-6 h-6">
              <Image
                src="/QRSquareIcon.svg"
                alt="QR Icon"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {petName}&apos;s Digital Tag QR Code
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Scan with any smartphone camera to access {petName}&apos;s medical profile & emergency contact info.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-5 py-4">
          {/* QR Container */}
          <div className="relative p-5 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center space-y-3">
            <div className="relative w-44 h-44">
              <Image
                src="/QRCodeSVG.svg"
                alt="Pet Tag QR Code"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-200">
              <span className="text-[11px] font-mono font-bold text-slate-700">
                TAG ID: {petTagId}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              onClick={handleCopy}
              variant="outline"
              className="h-10 rounded-xl border-slate-200 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-slate-500" />
                  <span>Copy Tag Link</span>
                </>
              )}
            </Button>

            <Button
              className="h-10 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
              <span>Share QR Code</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
