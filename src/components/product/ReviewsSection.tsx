import { db } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import ReviewForm from "./ReviewForm";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width="14" height="14" viewBox="0 0 24 24"
          fill={rating >= n ? "oklch(0.560 0.105 75)" : "none"}
          stroke="oklch(0.560 0.105 75)" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6-5.9-3.3-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5z" />
        </svg>
      ))}
    </span>
  );
}

export default async function ReviewsSection({
  productId,
  productSlug,
}: {
  productId: string;
  productSlug: string;
}) {
  const [reviews, session] = await Promise.all([
    db.review.findMany({
      where: { productId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    getCustomerSession(),
  ]);

  const avg =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  return (
    <section className="mt-16 border-t border-charcoal-line pt-10">
      <div className="flex flex-wrap items-baseline gap-4">
        <h2 className="font-display text-2xl text-charcoal-ink">Reviews</h2>
        {reviews.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-charcoal-muted">
            <Stars rating={Math.round(avg)} />
            {avg.toFixed(1)} · {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="mt-4 text-charcoal-muted">
          No reviews yet — be the first to share how this piece felt.
        </p>
      ) : (
        <div className="mt-6 flex flex-col divide-y divide-charcoal-line/60">
          {reviews.map((r) => (
            <div key={r.id} className="flex flex-col gap-2 py-5">
              <div className="flex flex-wrap items-center gap-3">
                <Stars rating={r.rating} />
                <span className="text-sm font-medium text-charcoal-ink">
                  {r.customer.name}
                </span>
                {r.verified && (
                  <span className="border border-gold-deep px-2 py-0.5 text-[0.6rem] font-medium uppercase tracking-[0.1em] text-gold-deep">
                    Verified Purchase
                  </span>
                )}
                <span className="text-xs text-charcoal-muted">
                  {r.createdAt.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="max-w-2xl leading-relaxed text-charcoal-muted">{r.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <h3 className="mb-4 text-sm font-medium text-charcoal-ink">Write a Review</h3>
        <ReviewForm productSlug={productSlug} signedIn={Boolean(session)} />
      </div>
    </section>
  );
}
