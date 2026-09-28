"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordNewForm({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", {
        description: "Please enter the same password twice.",
      });
      return;
    }

    setPending(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        if (payload?.error?.code === "invalid_token") {
          router.push("/reset-password?error=invalid_token");
          return;
        }

        toast.error("Password reset failed", {
          description: payload?.error?.message || "Password could not be reset.",
        });
        return;
      }

      router.push("/signin?reset=1");
    } catch {
      toast.error("Password reset failed", {
        description: "Password could not be reset. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-[13px] font-semibold leading-5 text-[#252525]">
          New password
        </span>
        <Input
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="At least 8 characters"
          className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
        />
      </label>
      <label className="block">
        <span className="text-[13px] font-semibold leading-5 text-[#252525]">
          Confirm password
        </span>
        <Input
          type="password"
          required
          minLength={8}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          placeholder="Confirm your password"
          className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
        />
      </label>
      <Button
        type="submit"
        disabled={pending}
        className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
      >
        {pending ? "Saving..." : "Reset password"}
      </Button>
    </form>
  );
}
