"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function PublicShareButton({
  id,
  name,
  className,
}: {
  id: string;
  name: string;
  className?: string;
}) {
  const [shareLink, setShareLink] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    const link = `${window.location.origin}/foster/${encodeURIComponent(id)}`;
    setShareLink(link);
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);

    QRCode.toDataURL(link, { errorCorrectionLevel: "H", margin: 1, width: 288 })
      .then(setQrCode)
      .catch(() => setQrCode(""));
  }, [id]);

  async function handleNativeShare() {
    if (!canShare || !shareLink) return;
    try {
      await navigator.share({
        title: `Meet ${name}`,
        text: `Check out ${name}'s foster profile!`,
        url: shareLink,
      });
    } catch (error) {
      // User cancelled or share failed silently
    }
  }

  async function handleCopyLink() {
    if (!shareLink) return;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Dialog>
      <DialogTrigger className={className}>
        <Button
          variant="outline"
          className="h-12 w-full rounded-[14px] px-6 text-base"
        >
          <Share2 className="size-4" />
          Share Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-[22px] bg-white p-6 sm:max-w-100">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl font-bold text-[#1a1a1a]">
            Share {name}
          </DialogTitle>
          <DialogDescription className="text-sm text-[#8a857e]">
            Help {name} find their forever home by sharing their profile.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex flex-col items-center gap-6">
          <div className="relative flex size-42 items-center justify-center rounded-[16px] bg-[#fbe9ee] p-3">
            {qrCode ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrCode}
                alt="QR Code"
                className="size-36 rounded-lg bg-white p-2"
              />
            ) : (
              <div
                aria-label="Generating QR code"
                className="size-36 animate-pulse rounded bg-white/50"
              />
            )}
          </div>

          <div className="flex w-full flex-col gap-3">
            {canShare && (
              <Button
                onClick={handleNativeShare}
                className="h-12 rounded-[14px] bg-[#e05a3a] text-white hover:bg-[#c94d30]"
              >
                <Share2 className="size-4 mr-2" />
                Share via...
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleCopyLink}
              className="h-12 rounded-[14px]"
            >
              {copied ? (
                <Check className="size-4 mr-2 text-green-600" />
              ) : (
                <Copy className="size-4 mr-2" />
              )}
              {copied ? "Link Copied!" : "Copy Link"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
