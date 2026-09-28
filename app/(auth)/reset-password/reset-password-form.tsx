"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordForm() {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error("Reset email failed", {
          description:
            payload?.error?.message ||
            "Reset instructions could not be sent. Please try again.",
        });
        return;
      }

      toast.success("Reset link sent", {
        description: payload?.data?.message || "Please check your email.",
      });
      setEmail("");
    } catch {
      toast.error("Reset email failed", {
        description: "Reset instructions could not be sent. Please try again.",
      });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-[13px] font-semibold leading-5 text-[#252525]">
          Email
        </span>
        <Input
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="jlturner@example.com"
          className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
        />
      </label>
      <label className="hidden" aria-hidden="true">
        Website
        <input
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </label>
      <Button
        type="submit"
        disabled={pending}
        className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
      >
        {pending ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  );
}
