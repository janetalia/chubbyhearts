"use client";

import Link from "next/link";
import { useActionState, useEffect, useMemo, useState } from "react";
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
  const displayName = user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "Your account";
  const profilePreview = profileImage || "/avatar/Image (Bella).svg";
  const memberSince = useMemo(() => formatMemberSince(user.createdAt), [user.createdAt]);

  function handleProfileFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Invalid image", {
        description: "Choose an image file for your profile photo.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

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
    <form action={formAction} className="max-w-309.75">
      <PageHeading
        title="Account"
        action={
          <Button
            type="submit"
            disabled={pending}
            className="hidden h-13.25 rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358] md:inline-flex"
          >
            <Save className="size-4" />
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        }
      />

      <div className="mt-5 grid gap-6 md:mt-[29px] lg:grid-cols-[395px_1fr]">
        <Card className="rounded-[16px] border-[#ede9e4] p-8 text-center shadow">
          <div className="mx-auto h-[156px] w-[156px] overflow-hidden rounded-full border border-[#ede9e4] bg-[#f9f5eb]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profilePreview}
              alt={displayName}
              className="h-full w-full object-cover"
            />
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
                placeholder="JL"
                defaultValue={user.firstName || ""}
              />
              <FormField
                label="Last name"
                name="lastName"
                placeholder="Turner"
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
              <div className="block md:col-span-2">
                <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                  Profile image
                </span>
                <div className="mt-2 flex">
                  <label className="group relative inline-flex cursor-pointer flex-col items-center justify-center">
                    {profileImage ? (
                      <div className="flex flex-col items-center gap-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={profileImage} alt="Profile preview" className="size-[88px] rounded-full object-cover border border-[#ede9e4]" />
                        <span className="text-sm font-semibold text-[#e05a3a] group-hover:underline">Change photo</span>
                      </div>
                    ) : (
                      <div className="flex size-[88px] items-center justify-center rounded-full border border-dashed border-[#d2cec9] bg-[#f9f5eb] text-[#a19d98] hover:bg-[#f0ebe0]">
                        <Camera className="size-6" />
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileFile}
                      className="sr-only"
                    />
                  </label>
                </div>
                <input type="hidden" name="image" value={profileImage} />
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end md:hidden">
          <Button
            type="submit"
            disabled={pending}
            className="h-13.25 w-full rounded-[16px] bg-[#ee9266] px-8.5 text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
          >
            <Save className="size-4" />
            {pending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
}
