import Image from "next/image";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Admin Sign In — Aval Designs",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; changed?: string }>;
}) {
  const params = await searchParams;
  const next = params.next ?? "/admin";
  const passwordChanged = params.changed === "1";

  return (
    <div className="flex min-h-svh items-center justify-center bg-espresso px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="" width={573} height={435} className="h-16 w-auto" priority />
          <span className="mt-3 font-display text-2xl font-semibold text-ivory">
            Aval Designs
          </span>
          <p className="mt-2 text-xs font-medium uppercase tracking-[0.16em] text-ivory/50">
            Admin
          </p>
        </div>
        {passwordChanged && (
          <p className="mb-6 bg-ivory/10 px-4 py-3 text-center text-sm text-ivory">
            Password updated — please sign in again.
          </p>
        )}
        <LoginForm next={next} />
      </div>
    </div>
  );
}
