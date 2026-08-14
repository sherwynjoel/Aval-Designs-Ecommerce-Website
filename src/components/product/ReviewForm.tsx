"use client";

import { useActionState, useState } from "react";
import { submitReviewAction, type ReviewState } from "@/actions/reviews";

export default function ReviewForm({
  productSlug,
  signedIn,
}: {
  productSlug: string;
  signedIn: boolean;
}) {
  const action = submitReviewAction.bind(null, productSlug);
  const [state, formAction, pending] = useActionState(action, {} as ReviewState);
  const [rating, setRating] = useState(0);

  if (!signedIn) {
    return (
      <p className="text-sm text-charcoal-muted">
        <a href="/account" className="underline underline-offset-2 hover:text-rose-deep">
          Sign in
        </a>{" "}
        to write a review.
      </p>
    );
  }

  if (state.success) {
    return <p className="text-sm text-charcoal-ink">Thank you — your review is live.</p>;
  }

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-4">
      <div>
        <span className="mb-2 block text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
          Your Rating
        </span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} star${n > 1 ? "s" : ""}`}
              aria-pressed={rating >= n}
              className="cursor-pointer p-0.5"
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={rating >= n ? "oklch(0.560 0.105 75)" : "none"}
                stroke="oklch(0.560 0.105 75)" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z" />
              </svg>
            </button>
          ))}
        </div>
        <input type="hidden" name="rating" value={rating || ""} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="review-body" className="text-xs font-medium uppercase tracking-[0.12em] text-charcoal-muted">
          Your Review
        </label>
        <textarea
          id="review-body"
          name="body"
          rows={3}
          required
          minLength={10}
          maxLength={2000}
          placeholder="How was the fit, the fabric, the moment you wore it?"
          className="border border-charcoal-line bg-transparent px-3 py-2.5 text-sm text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
        />
      </div>

      {state.error && <p role="alert" className="text-sm text-rose-deep">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-fit bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory hover:bg-espresso disabled:opacity-50 cursor-pointer"
      >
        {pending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
