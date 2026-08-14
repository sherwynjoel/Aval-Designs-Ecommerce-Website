"use client";

import { useActionState } from "react";
import { changePasswordAction, type ChangePasswordState } from "@/actions/admin-auth";

const initialState: ChangePasswordState = {};

export default function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initialState);

  const field =
    "w-full border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink focus:border-charcoal-ink focus:outline-none";
  const label = "text-xs font-medium uppercase tracking-[0.1em] text-charcoal-muted";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="current" className={label}>Current Password</label>
        <input id="current" name="current" type="password" required autoComplete="current-password" className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="new1" className={label}>New Password (min 10 characters)</label>
        <input id="new1" name="new1" type="password" required minLength={10} autoComplete="new-password" className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="new2" className={label}>Confirm New Password</label>
        <input id="new2" name="new2" type="password" required minLength={10} autoComplete="new-password" className={field} />
      </div>

      {state.error && (
        <p role="alert" className="text-sm text-rose-deep">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 w-fit bg-charcoal-ink px-6 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-ivory hover:bg-espresso disabled:opacity-50 cursor-pointer"
      >
        {pending ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
}
