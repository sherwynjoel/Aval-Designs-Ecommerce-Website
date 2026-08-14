"use client";

import { useActionState, useState } from "react";
import {
  customerSignupAction,
  customerLoginAction,
  type CustomerAuthState,
} from "@/actions/customer-auth";

const initial: CustomerAuthState = {};

const field =
  "w-full border-b border-charcoal-line bg-transparent px-1 py-3 text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none";
const label = "text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted";
const submit =
  "mt-2 bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso disabled:opacity-50 cursor-pointer";

export default function AuthForms() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loginState, loginAction, loginPending] = useActionState(customerLoginAction, initial);
  const [signupState, signupAction, signupPending] = useActionState(customerSignupAction, initial);

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 flex gap-6 border-b border-charcoal-line">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`pb-3 text-xs font-medium uppercase tracking-[0.14em] cursor-pointer ${
              mode === m
                ? "border-b-2 border-charcoal-ink text-charcoal-ink"
                : "text-charcoal-muted hover:text-charcoal-ink"
            }`}
          >
            {m === "login" ? "Sign In" : "Create Account"}
          </button>
        ))}
      </div>

      {mode === "login" ? (
        <form action={loginAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-email" className={label}>Email</label>
            <input id="login-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="login-password" className={label}>Password</label>
            <input id="login-password" name="password" type="password" required autoComplete="current-password" className={field} />
          </div>
          {loginState.error && <p role="alert" className="text-sm text-rose-deep">{loginState.error}</p>}
          <button type="submit" disabled={loginPending} className={submit}>
            {loginPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      ) : (
        <form action={signupAction} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="su-name" className={label}>Full Name</label>
            <input id="su-name" name="name" required autoComplete="name" className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="su-email" className={label}>Email</label>
            <input id="su-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="su-phone" className={label}>Phone</label>
            <input id="su-phone" name="phone" type="tel" required autoComplete="tel" className={field} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="su-password" className={label}>Password (min 8 characters)</label>
            <input id="su-password" name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
          </div>
          {signupState.error && <p role="alert" className="text-sm text-rose-deep">{signupState.error}</p>}
          <button type="submit" disabled={signupPending} className={submit}>
            {signupPending ? "Creating..." : "Create Account"}
          </button>
          <p className="text-xs text-charcoal-muted">
            Ordered as a guest before? Sign up with the same email and your
            order history appears automatically.
          </p>
        </form>
      )}
    </div>
  );
}
