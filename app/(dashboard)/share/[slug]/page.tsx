"use client";

import Image from "next/image";
import { use, useState } from "react";
import { Heart, MessageSquare, Share2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFosters, shareUrl } from "@/lib/fosters";

export default function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const fosters = useFosters();
  const foster = fosters.find((item) => item.name.toLowerCase() === slug.toLowerCase());

  if (!foster) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-semibold">Card not found</h1>
      </div>
    );
  }

  return <ShareView foster={foster} />;
}

function ShareView({ foster }: { foster: NonNullable<ReturnType<typeof useFosters>[number]> }) {
  const [copied, setCopied] = useState(false);
  const link = shareUrl(foster);

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: foster.name, url: link });
        return;
      } catch {
        // Person closed the share sheet without picking anything.
      }
    }
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSendText() {
    if (navigator.share) {
      try {
        await navigator.share({ title: foster.name, text: `Check out ${foster.name}'s card`, url: link });
        return;
      } catch {
        // Person closed the share sheet without picking anything.
      }
    }
    window.location.href = `sms:?&body=${encodeURIComponent(link)}`;
  }

  function handleSaveQr() {
    const anchor = document.createElement("a");
    anchor.href = "/QRCodeSVG.svg";
    anchor.download = `${foster.name}-qr-code.svg`;
    anchor.click();
  }

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-[#1a1a1a]">Share</h1>
        <Button onClick={handleShare} className="gap-2 rounded-[12px] bg-primary h-12 text-xs px-10 text-white hover:bg-primary/90">
          <Share2 className="size-4" />
          {copied ? "Link copied" : "Share"}
        </Button>
      </div>

      <div className="max-w-fit">

        <div className="relative mt-6 size-24 overflow-hidden rounded-[16px] bg-secondary">
        {foster.image && (
          <Image src={foster.image} alt={foster.name} fill unoptimized sizes="120px" className="object-cover h-30 w-auto" />
        )}
      </div>

      <h2 className="mt-4 text-3xl font-bold text-[#1a1a1a]">{foster.name}</h2>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#8a857e]">
        {/* <Shield className="size-3.5" /> */}
        Rescue: {foster.rescue}
      </p>

      <Card className="mt-6 flex flex-col items-center gap-4 rounded-[16px] border-[#ede9e4] bg-[#fbe9ee] p-6">
        <div className="relative flex size-[168px] items-center justify-center rounded-[16px] bg-white">
          <Image src="/QRCodeSVG.svg" alt={`QR code for ${foster.name}'s card`} width={144} height={144} />
          <span className="absolute flex size-9 items-center justify-center rounded-full bg-white">
            <Heart className="size-5 fill-[#e05a3a] text-[#e05a3a]" />
          </span>
        </div>
        <p className="text-sm text-[#8a857e]">Scan to view {foster.name}&apos;s card</p>
      </Card>

      <div className="mt-6">
        <p className="text-sm font-semibold text-[#1a1a1a]">Or share via</p>
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            onClick={handleSendText}
            className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#ede9e4] bg-white p-3 text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fbe9ee]">
              <MessageSquare className="size-4"/>
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#1a1a1a]">Text</span>
              <span className="block text-xs text-[#8a857e]">Send a link</span>
            </span>
          </button>
          <button
            type="button"
            onClick={handleSaveQr}
            className="flex flex-1 items-center gap-3 rounded-[16px] border border-[#ede9e4] bg-white p-3 text-left"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#fbe9ee]">
              <Image src="/QRSquareIcon.svg" alt="" width={16} height={16} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#1a1a1a]">QR Code</span>
              <span className="block text-xs text-[#8a857e]">Save or share image</span>
            </span>
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}