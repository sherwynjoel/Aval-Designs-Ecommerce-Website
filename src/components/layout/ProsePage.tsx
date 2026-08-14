export default function ProsePage({
  title,
  intro,
  children,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-4xl font-medium text-charcoal-ink">{title}</h1>
      {intro && <p className="mt-4 leading-relaxed text-charcoal-muted">{intro}</p>}
      <div className="mt-10 flex flex-col gap-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-charcoal-ink [&_p]:mt-2 [&_p]:leading-relaxed [&_p]:text-charcoal-muted [&_li]:leading-relaxed [&_li]:text-charcoal-muted [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
        {children}
      </div>
    </div>
  );
}
