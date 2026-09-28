"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithGoogle, registerWithPassword } from "../actions";

export default function SignupCard() {
  const [state, formAction, pending] = useActionState(registerWithPassword, {});

  useEffect(() => {
    if (!state.error) return;

    toast.error("Signup failed", {
      description: state.error,
      id: "signup-error",
    });
  }, [state.error]);

  return (
    <>
      <header className="flex h-[81px] items-center justify-between border-b border-[#ede9e4] bg-white px-5 md:px-8">
        <Link href="/signin" className="relative h-[46px] w-[160px]">
          <Image
            src="/logo/Frame 2147235265.svg"
            alt="Chubby Hearts Logo"
            fill
            className="object-contain"
            priority
          />
        </Link>
        <Link
          href="/signin"
          className="inline-flex h-12 items-center justify-center rounded-[12px] bg-[#ee9266] px-7 text-base font-medium text-white hover:bg-[#df8358]"
        >
          Sign In
        </Link>
      </header>

      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-10">
        <section className="w-full max-w-[418px] rounded-[37px] bg-white px-8 py-[34px]">
          <div className="flex justify-center">
            <Image
              src="/logo/image 34.svg"
              alt="Chubby Hearts"
              width={210}
              height={99}
              priority
              className="object-contain"
            />
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold text-[#1a1a1a]">
            Create your account
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-[#6f6b65]">
            Start saving your foster pet cards.
          </p>

          <form action={loginWithGoogle} className="mt-8">
            <Button
              type="submit"
              variant="outline"
              className="h-[55px] w-full rounded-2xl border-[#e9e5de] bg-white text-sm font-semibold text-[#252525] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-white"
            >
              <Image src="/icons/GoogleIcon.svg" alt="" width={18} height={18} />
              Continue with Google
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs font-semibold text-[#9a958f]">
            <span className="h-px flex-1 bg-[#ede9e4]" />
            or
            <span className="h-px flex-1 bg-[#ede9e4]" />
          </div>

          <form action={formAction} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                  First name
                </span>
                <Input
                  name="firstName"
                  required
                  placeholder="JL"
                  className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                />
              </label>
              <label className="block">
                <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                  Last name
                </span>
                <Input
                  name="lastName"
                  required
                  placeholder="Turner"
                  className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                />
              </label>
            </div>
            <label className="block">
              <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                Email
              </span>
              <Input
                name="email"
                type="email"
                required
                placeholder="jlturner@example.com"
                className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
              />
            </label>
            <label className="block">
              <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                Password
              </span>
              <Input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="At least 8 characters"
                className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
              />
            </label>

            <Button
              type="submit"
              disabled={pending}
              className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
            >
              {pending ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="pt-5 text-center text-sm text-[#6f6b65]">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-[#e05a3a] underline-offset-4 hover:underline">
              Sign in
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
