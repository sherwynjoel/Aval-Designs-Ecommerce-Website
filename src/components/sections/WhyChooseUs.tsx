const reasons = [
  {
    title: "Made to Your Measurements",
    body: "Every occasion piece can be tailored to your exact bust, waist, hip, and length — not a generic size chart.",
  },
  {
    title: "Fabric You Can Trust",
    body: "Silk, georgette, chiffon, and velvet sourced for how they move and photograph, not just how they look on a hanger.",
  },
  {
    title: "A Real Person, Every Step",
    body: "From your first fabric question to your final fitting note, you're working with our atelier team — not a support queue.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-12 lg:py-28">
      <h2 className="max-w-lg font-display text-4xl font-medium text-charcoal-ink lg:text-5xl">
        Why Aval Designs
      </h2>

      <div className="mt-14 grid grid-cols-1 divide-y divide-charcoal-line sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
        {reasons.map((r) => (
          <div key={r.title} className="flex flex-col gap-3 py-8 sm:px-8 sm:py-0 first:pl-0">
            <h3 className="font-display text-xl font-medium text-charcoal-ink">
              {r.title}
            </h3>
            <p className="text-charcoal-muted leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
