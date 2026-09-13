import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#f9f5eb] font-sans text-[#252525]">
      <header className="flex h-[81px] items-center justify-between border-b border-[#ede9e4] bg-white px-5 md:px-8">
        <Link href="/signin" className="relative h-[46px] w-[160px]" aria-label="Back to sign in">
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
          <Link href="/signin" className="inline-flex items-center gap-2 text-sm font-semibold text-[#6f6b65] hover:text-[#252525]">
            <ArrowLeft className="size-4" />
            Back to sign in
          </Link>

          <div className="mt-8 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#f9f5eb] text-[#e05a3a]">
              <Mail className="size-6" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold text-[#1a1a1a]">Reset your password</h1>
          <p className="mt-3 text-center text-sm leading-6 text-[#6f6b65]">
            Enter your email and we will send password reset instructions.
          </p>

          <form className="mt-8 space-y-4">
            <label className="block">
              <span className="text-[13px] font-semibold leading-5 text-[#252525]">Email</span>
              <Input
                type="email"
                placeholder="jlturner@example.com"
                className="mt-2 h-[51px] rounded-[16px] border-[#e9e5de] bg-white px-4 text-sm text-[#252525] placeholder:text-[#bfbbb5] focus-visible:ring-[#ee9266]/30"
              />
            </label>
            <Button
              type="submit"
              className="h-[53px] w-full rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
            >
              Send reset link
            </Button>
          </form>
        </section>
      </main>
    </div>
  );
}
