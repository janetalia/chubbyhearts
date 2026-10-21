"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { Calendar, Camera, KeyRound, Mail, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import FormField from "../components/form-field";
import PageHeading from "../components/page-heading";
import { updateAccount } from "./actions";

type AccountUser = {
  id: string;
  name: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  image: string | null;
  createdAt: number | string;
};

// Leave room for the other fields and Server Action encoding below the 1 MiB limit.
const PROFILE_IMAGE_BUDGET = 700_000;
const PROFILE_IMAGE_DIMENSIONS = [800, 640, 512, 384, 320];

async function prepareProfileImage(file: File): Promise<string> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Please choose a JPG, PNG or WebP photo.");
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Please select an image no larger than 2MB.");
  }

  const image = new Image();
  const objectUrl = URL.createObjectURL(file);

  try {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error("This photo could not be opened. Please choose another image."));
      image.src = objectUrl;
    });

    const { naturalWidth: width, naturalHeight: height } = image;
    if (!width || !height) throw new Error("This photo has invalid dimensions.");

    const encodedLength = `data:${file.type};base64,`.length + 4 * Math.ceil(file.size / 3);
    if (Math.max(width, height) <= PROFILE_IMAGE_DIMENSIONS[0] && encodedLength <= PROFILE_IMAGE_BUDGET) {
      const original = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => typeof reader.result === "string"
          ? resolve(reader.result)
          : reject(new Error("This photo could not be read. Please try another image."));
        reader.onerror = reader.onabort = () => reject(new Error("This photo could not be read. Please try another image."));
        reader.readAsDataURL(file);
      });
      if (original.length <= PROFILE_IMAGE_BUDGET) return original;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Photo processing is unavailable. Please try another browser.");

    for (const maxDimension of PROFILE_IMAGE_DIMENSIONS) {
      const scale = Math.min(1, maxDimension / Math.max(width, height));
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // Retain PNG/WebP transparency instead of flattening the photo into JPEG.
      const encoded = canvas.toDataURL(file.type, 0.85);
      if (/^data:image\/(jpeg|png|webp);base64,/.test(encoded) && encoded.length <= PROFILE_IMAGE_BUDGET) {
        return encoded;
      }
    }

    throw new Error("This photo could not be made small enough. Please choose a smaller image.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function formatMemberSince(value: number | string) {
  const date = typeof value === "number" ? new Date(value) : new Date(value);

  if (Number.isNaN(date.getTime())) return "Member";

  return `Member since ${date.getFullYear()}`;
}

export default function AccountForm({
  user,
  hasGoogleAccount,
}: {
  user: AccountUser;
  hasGoogleAccount: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateAccount, {});
  const [profileImage, setProfileImage] = useState(user.image || "");
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const imageRequest = useRef(0);
  const imageProcessing = useRef(false);
  const submitStarted = useRef(false);
  const displayName = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Your account";
  const profilePreview = profileImage || "/avatar/DogIllustration.svg";
  const memberSince = useMemo(() => formatMemberSince(user.createdAt), [user.createdAt]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    if (pending || submitStarted.current) return;

    const request = ++imageRequest.current;
    imageProcessing.current = Boolean(file);
    setIsProcessingImage(Boolean(file));
    if (!file) return;

    try {
      const image = await prepareProfileImage(file);
      if (request === imageRequest.current) setProfileImage(image);
    } catch (error) {
      if (request === imageRequest.current) {
        toast.error("Profile photo could not be changed", {
          description: error instanceof Error ? error.message : "Please try another image.",
        });
      }
    } finally {
      if (request === imageRequest.current) {
        imageProcessing.current = false;
        setIsProcessingImage(false);
      }
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (imageProcessing.current || submitStarted.current || pending) {
      event.preventDefault();
      return;
    }
    if (profileImage !== (user.image || "") && profileImage.length > PROFILE_IMAGE_BUDGET) {
      event.preventDefault();
      toast.error("Profile photo is too large", { description: "Please choose a smaller image." });
      return;
    }
    submitStarted.current = true;
  };

  useEffect(() => () => { imageRequest.current += 1; }, []);

  useEffect(() => {
    if (!pending) submitStarted.current = false;
  }, [pending, state]);

  useEffect(() => {
    if (state.success) {
      toast.success("Account updated successfully.");
    }

    if (state.error) {
      toast.error("Account update failed", {
        description: state.error,
        id: "account-update-error",
      });
    }
  }, [state.error, state.success]);

  return (
    <form action={formAction} onSubmit={handleSubmit} className="max-w-309.75">
      {profileImage !== (user.image || "") && (
        <input type="hidden" name="image" value={profileImage} />
      )}
      <PageHeading
        title="Account"
        action={
          <Button
            type="submit"
            disabled={pending || isProcessingImage}
            className="hidden h-13.25 rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358] md:inline-flex"
          >
            <Save className="size-4" />
            {pending ? "Saving..." : isProcessingImage ? "Processing photo..." : "Save Changes"}
          </Button>
        }
      />

      <div className="mt-5 grid gap-6 md:mt-[29px] lg:grid-cols-[395px_1fr]">
        <Card className="rounded-[16px] border-[#ede9e4] p-8 text-center shadow">
          <div className="relative mx-auto h-[156px] w-[156px]" aria-busy={isProcessingImage}>
            <div className="h-full w-full overflow-hidden rounded-full border border-[#ede9e4] bg-[#f9f5eb]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={profilePreview}
                alt={displayName}
                className="h-full w-full object-contain"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-1 right-1 flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#ee9266] text-white shadow-md hover:bg-[#df8358] transition-colors"
              title="Change photo"
            >
              <Camera className="size-5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                disabled={pending}
                onChange={handleImageChange}
              />
            </label>
          </div>
          <h2 className="mt-4 text-[32px] font-semibold text-[#1a1a1a]">
            {displayName}
          </h2>
          <div className="mt-4 space-y-3 text-left text-sm text-[#6f6b65]">
            <p className="flex items-center gap-3">
              <Mail className="h-4 w-4" /> {user.email || "No email"}
            </p>
            <p className="flex items-center gap-3">
              <Calendar className="h-4 w-4" /> {memberSince}
            </p>
          </div>
          {!hasGoogleAccount && (
            <Link
              href="/reset-password"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] border border-[#e9e5de] text-sm font-semibold text-[#252525] hover:bg-[#f9f5eb]"
            >
              <KeyRound className="h-4 w-4 text-[#e05a3a]" />
              Reset password
            </Link>
          )}
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[16px] border-[#ede9e4] p-6 shadow">
            <h2 className="text-base font-semibold text-[#252525]">
              Personal information
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 md:gap-x-6">
              <FormField
                label="First name"
                name="firstName"
                placeholder="First name"
                defaultValue={user.firstName || ""}
              />
              <FormField
                label="Last name"
                name="lastName"
                placeholder="Last name"
                defaultValue={user.lastName || ""}
              />
              <FormField
                label="Email"
                name="email"
                type="email"
                placeholder="jlturner@example.com"
                value={user.email || ""}
                disabled
                readOnly
              />
              <FormField
                label="Phone"
                name="phone"
                placeholder="(555) 219-8044"
                defaultValue={user.phone || ""}
              />
             
            </div>
          </Card>
        </div>

        <div className="flex justify-end md:hidden">
          <Button
            type="submit"
            disabled={pending || isProcessingImage}
            className="h-13.25 w-full rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
          >
            <Save className="size-4" />
            {pending ? "Saving..." : isProcessingImage ? "Processing photo..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
