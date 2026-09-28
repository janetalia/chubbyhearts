import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import QueryToast from "@/components/query-toast";
import ResetPasswordNewForm from "./reset-password-new-form";

export default async function NewPasswordPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const token = typeof params.token === "string" ? params.token : "";

  return (
    <div className="min-h-screen bg-[#f9f5eb] font-sans text-[#252525]">
      {(!email || !token) && (
        <QueryToast
          id="missing-reset-token"
          title="Reset link invalid"
          description="Please request a new reset link."
          type="error"
        />
      )}
      <header className="flex h-[81px] items-center justify-between border-b border-[#ede9e4] bg-white px-5 md:px-8">
        <Link
          href="/signin"
          className="relative h-[46px] w-[160px]"
          aria-label="Back to sign in"
        >
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
          <Link
            href="/reset-password"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#6f6b65] hover:text-[#252525]"
          >
            <ArrowLeft className="size-4" />
            Request new link
          </Link>

          <div className="mt-8 flex justify-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-[#f9f5eb] text-[#e05a3a]">
              <KeyRound className="size-6" />
            </div>
          </div>

          <h1 className="mt-5 text-center text-2xl font-semibold text-[#1a1a1a]">
            Create a new password
          </h1>
          <p className="mt-3 text-center text-sm leading-6 text-[#6f6b65]">
            Enter a new password for your account.
          </p>

          {email && token ? (
            <ResetPasswordNewForm email={email} token={token} />
          ) : (
            <div className="mt-8 space-y-4 text-center">
              <Link
                href="/reset-password"
                className="inline-flex h-[53px] w-full items-center justify-center rounded-2xl bg-[#ee9266] text-sm font-semibold text-white shadow-[0_4px_8px_rgba(217,111,97,0.3)] hover:bg-[#df8358]"
              >
                Request new link
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
