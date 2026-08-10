"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/actions/admin-auth";

const initialState: LoginState = {};

export default function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="next" value={next} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-[0.12em] text-ivory/70">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full border-b border-ivory/25 bg-transparent px-1 py-3 text-ivory placeholder:text-ivory/40 focus:border-ivory focus:outline-none"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-[0.12em] text-ivory/70">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border-b border-ivory/25 bg-transparent px-1 py-3 text-ivory placeholder:text-ivory/40 focus:border-ivory focus:outline-none"
        />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-rose-pale">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 bg-ivory px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-espresso transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 cursor-pointer"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
