import QueryToast from "@/components/query-toast";
import SigninCard from "./components/signin-card";

export default async function SigninPage({
  searchParams,
}: PageProps<"/signin">) {
  const params = await searchParams;

  return (
    <div className="min-h-screen bg-[#f9f5eb] font-sans text-[#252525]">
      {params.registered === "1" && (
        <QueryToast
          id="account-created"
          title="Account created"
          description="Sign in to continue."
          type="success"
        />
      )}
      {params.reset === "1" && (
        <QueryToast
          id="password-reset"
          title="Password reset successfully"
          description="Sign in to continue."
          type="success"
        />
      )}
      <SigninCard />
    </div>
  );
}
