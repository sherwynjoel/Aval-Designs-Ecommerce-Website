export default function Newsletter() {
  return (
    <section className="bg-ivory-deep px-6 py-20 lg:px-12 lg:py-24">
      <div className="mx-auto flex max-w-xl flex-col items-center text-center">
        <h2 className="font-display text-3xl font-medium text-charcoal-ink lg:text-4xl">
          Be the first to discover what&apos;s new.
        </h2>
        <p className="mt-3 text-charcoal-muted">
          New collections, styling notes, and early access to limited pieces —
          straight to your inbox.
        </p>

        <form className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Your email address"
            className="w-full border-b border-charcoal-line bg-transparent px-1 py-3 text-charcoal-ink placeholder:text-charcoal-muted focus:border-charcoal-ink focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 bg-charcoal-ink px-8 py-3 text-xs font-medium uppercase tracking-[0.14em] text-ivory transition-colors duration-200 hover:bg-espresso cursor-pointer"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
