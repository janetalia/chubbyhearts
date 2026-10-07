"use client";

import Image from "next/image";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Foster } from "@/lib/fosters";


export default function ShareFosterView({ foster }: { foster: Foster }) {
  const [shareLink, setShareLink] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const link = `${window.location.origin}/foster/${encodeURIComponent(foster.id)}`;
    setShareLink(link);
    QRCode.toDataURL(link, { errorCorrectionLevel: "H", margin: 1, width: 288 })
      .then(setQrCode)
      .catch(() => setQrCode(""));
  }, [foster.id]);

  async function handleCopyLink() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleSaveQr() {
    if (!qrCode) return;
    const anchor = document.createElement("a");
    anchor.href = qrCode;
    anchor.download = `${foster.name}-qr-code.png`;
    anchor.click();
  }

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Share</h1>
      </div>

      <div className="max-w-fit">
        <div className="relative mt-6 size-24 overflow-hidden rounded-[16px] bg-secondary">
          {foster.image && (
            <Image src={foster.image} alt={foster.name} fill unoptimized sizes="120px" className="object-cover" />
          )}
        </div>

        <h2 className="mt-4 text-3xl font-bold text-[#1a1a1a]">{foster.name}</h2>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-[#8a857e]">Rescue: {foster.rescue}</p>

        <Card className="mt-6 flex flex-col items-center gap-4 rounded-[16px] border-[#ede9e4] bg-[#fbe9ee] p-6">
          <div className="relative flex size-[168px] items-center justify-center rounded-[16px] bg-white">
            {qrCode ? (
              <Image src={qrCode} alt={`QR code linking to ${foster.name}'s public foster page`} width={144} height={144} unoptimized />
            ) : (
              <div aria-label="Generating QR code" className="size-36 animate-pulse rounded bg-[#f3f0ed]" />
            )}
          </div>
          <p className="text-sm text-[#8a857e]">Scan to view {foster.name}&apos;s card</p>
        </Card>

        <div className="mt-6">
          <p className="text-sm font-semibold text-[#1a1a1a]">Or share via</p>
          <div className="mt-3 flex gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#ede9e4] bg-white p-3 text-left"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fbe9ee]">
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#1a1a1a]">{copied ? "Copied" : "Copy link"}</span>
                <span className="block text-xs text-[#8a857e]">Share the public page</span>
              </span>
            </button>
            <button
              type="button"
              onClick={handleSaveQr}
              disabled={!qrCode}
              className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#ede9e4] bg-white p-3 text-left disabled:opacity-50"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fbe9ee]">
                <Share2 className="size-4" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#1a1a1a]">QR Code</span>
                <span className="block text-xs text-[#8a857e]">Save image</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}