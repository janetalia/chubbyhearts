"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginWithGoogle, loginWithPassword, registerWithPassword, checkEmailExists } from "../../actions";

export default function SigninCard() {
  const [loginState, loginFormAction, loginPending] = useActionState(loginWithPassword, {});
  const [registerState, registerFormAction, registerPending] = useActionState(registerWithPassword, {});
  
  const [step, setStep] = useState<'initial' | 'email' | 'signin' | 'signup'>('initial');
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (loginState.error) {
      toast.error("Sign in failed", {
        description: loginState.error,
        id: "signin-error",
      });
    }
  }, [loginState.error]);

  useEffect(() => {
    if (registerState.error) {
      toast.error("Signup failed", {
        description: registerState.error,
        id: "signup-error",
      });
    }
  }, [registerState.error]);

  const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;

    setIsChecking(true);
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setStep('signin');
      } else {
        setStep('signup');
      }
    } catch (error) {
      toast.error("Error", {
        description: "Could not verify email. Please try again.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-5 py-10">
      <section className="w-full max-w-104.5 rounded-[37px] bg-white px-8 pb-6 pt-8.5">
        <div className="flex flex-col items-center gap-4.25">
          <img
            src="/logo/image 35.svg"
            alt=""
            width="336"
            height="218"
            className="h-40 sm:h-54.5 w-64 sm:w-84 max-w-full object-contain"
          />
          <img
            src="/logo/image 34.svg"
            alt="Chubby Hearts"
            width="230"
            height="109"
            className="h-20 sm:h-27.25 w-44 sm:w-57.5 object-contain"
          />
        </div>

        {step === 'initial' && (
          <p className="pt-2.5 text-center text-[14.5px] leading-[23.563px] text-[#6f6b65]">
            Helping them find their way home
          </p>
        )}
        
        {step === 'signup' && (
          <div className="pt-2.5">
            <h1 className="text-center text-xl font-semibold text-[#1a1a1a]">
              Create your account
            </h1>
            <p className="mt-1 text-center text-sm leading-6 text-[#6f6b65]">
              Start saving your foster pet cards.
            </p>
          </div>
        )}

        <div className="pt-12">
          {step === 'initial' && (
            <>
              <form action={loginWithGoogle} className="pb-3">
                <Button
                  type="submit"
                  variant="outline"
                  className="h-13.75 w-full rounded-2xl border-[#e9e5de] bg-white text-sm font-semibold text-[#252525] shadow-[0_1px_1.5px_rgba(0,0,0,0.1),0_1px_1px_rgba(0,0,0,0.1)] hover:bg-white"
                >
                  <Image src="/icons/GoogleIcon.svg" alt="" width={18} height={18} />
                  Continue with Google
                </Button>
              </form>
              <Button
                type="button"
                onClick={() => setStep('email')}
                className="h-13.25 w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
              >
                Continue with email
              </Button>
            </>
          )}

          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <label className="block">
                <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                  Email
                </span>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder="jlturner@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                />
              </label>
              <Button
                type="submit"
                disabled={isChecking}
                className="h-13.25 w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
              >
                {isChecking ? "Checking..." : "Continue"}
              </Button>
              <button
                type="button"
                onClick={() => setStep('initial')}
                className="w-full text-center text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline"
              >
                Back
              </button>
            </form>
          )}

          {step === 'signin' && (
            <>
              <form action={loginFormAction} className="space-y-3">
                <input type="hidden" name="email" value={email} />
                <label className="block">
                  <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                    Email
                  </span>
                  <Input
                    type="email"
                    disabled
                    value={email}
                    className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-[#f8f6f3] px-4 text-sm text-[#8c8883] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
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
                    className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                  />
                </label>
                <Button
                  type="submit"
                  disabled={loginPending}
                  className="h-13.25 w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
                >
                  {loginPending ? "Signing in..." : "Sign in"}
                </Button>
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="w-full text-center text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline"
                >
                  Back
                </button>
              </form>
              <div className="pt-4 text-center">
                <Link href="/reset-password" className="text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </>
          )}

          {step === 'signup' && (
            <form action={registerFormAction} className="space-y-3">
              <input type="hidden" name="email" value={email} />
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                    First name
                  </span>
                  <Input
                    name="firstName"
                    required
                    placeholder="JL"
                    className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
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
                    className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                  />
                </label>
              </div>
              <label className="block">
                <span className="text-[13px] font-semibold leading-5 text-[#252525]">
                  Email
                </span>
                <Input
                  type="email"
                  disabled
                  value={email}
                  className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-[#f8f6f3] px-4 text-sm text-[#8c8883] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
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
                  className="mt-2 h-12.75 rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
                />
              </label>

              <Button
                type="submit"
                disabled={registerPending}
                className="h-13.25 w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
              >
                {registerPending ? "Creating account..." : "Create account"}
              </Button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-center text-sm font-semibold text-[#e05a3a] underline-offset-4 hover:underline"
              >
                Back
              </button>
            </form>
          )}

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
  );
}
