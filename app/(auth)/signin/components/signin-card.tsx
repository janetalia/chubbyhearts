"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithGoogle, loginWithPassword } from "../../actions";

export default function SigninCard() {
  const [state, formAction, pending] = useActionState(loginWithPassword, {});
  const [showEmailForm, setShowEmailForm] = useState(false);

  useEffect(() => {
    if (!state.error) return;

    toast.error("Sign in failed", {
      description: state.error,
      id: "signin-error",
    });
  }, [state.error]);

  return (
    <>
      <header className="flex h-[81px] items-center justify-between border-b border-[#ede9e4] bg-white px-5 md:px-8">
        <div className="relative h-[46px] w-[160px]">
          <Image
            src="/logo/Frame 2147235265.svg"
            alt="Chubby Hearts Logo"
            fill
            className="object-contain"
            priority
          />
        </div>
        <Button className="h-12 rounded-[12px] bg-[#ee9266] px-7 text-base font-medium text-white shadow-none hover:bg-[#df8358]">
          Sign In
        </Button>
      </header>

      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-10">
        <section className="w-full max-w-[418px] rounded-[37px] bg-white px-8 pb-6 pt-[34px]">
          <div className="flex flex-col items-center gap-[17px]">
            <Image
              src="/logo/image 35.svg"
              alt=""
              width={336}
              height={218}
              priority
              className="h-[218px] w-[336px] max-w-full object-contain"
            />
            <Image
              src="/logo/image 34.svg"
              alt="Chubby Hearts"
              width={230}
              height={109}
              priority
              className="h-[109px] w-[230px] object-contain"
            />
          </div>

          <p className="pt-2.5 text-center text-[14.5px] leading-[23.563px] text-[#6f6b65]">
            Share their story with just a scan
          </p>
          <div className="pt-12">
            <form action={loginWithGoogle} className="pb-3">
              <Button
                type="submit"
                variant="outline"
                className="h-[55px] w-full rounded-2xl border-[#e9e5de] bg-white text-sm font-semibold text-[#252525] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-white"
              >
                <Image src="/icons/GoogleIcon.svg" alt="" width={18} height={18} />
                Continue with Google
              </Button>
            </form>
            {!showEmailForm ? (
              <Button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
              >
                Sign in with email
              </Button>
            ) : (
              <form action={formAction} className="space-y-3">
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
                    placeholder="Enter your password"
                    className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                  />
                </label>
                <Button
                  type="submit"
                  disabled={pending}
                  className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
                >
                  {pending ? "Signing in..." : "Sign in"}
                </Button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="w-full text-center text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline"
                >
                  Back
                </button>
              </form>
            )}
            <div className="pt-4 text-center">
              <Link href="/reset-password" className="text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline">
                Forgot your password?
              </Link>
            </div>
            <p className="pt-4 text-center text-sm text-[#6f6b65]">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-[#e05a3a] underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </div>

          <p className="pt-9 text-center text-xs leading-[19.5px] text-[#666]">
            By continuing, you agree to our{" "}
            <a href="#" className="text-[#080808] underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="text-[#080808] underline">
              Privacy Policy
            </a>
            .
          </p>
        </section>
      </main>
    </>
  );
}
