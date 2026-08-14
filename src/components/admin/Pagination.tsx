import Link from "next/link";

export const ADMIN_PAGE_SIZE = 15;

export default function Pagination({
  page,
  totalCount,
  basePath,
  searchParams = {},
}: {
  page: number;
  totalCount: number;
  basePath: string;
  searchParams?: Record<string, string>;
}) {
  const totalPages = Math.max(1, Math.ceil(totalCount / ADMIN_PAGE_SIZE));
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const params = new URLSearchParams(searchParams);
    if (p > 1) params.set("page", String(p));
    else params.delete("page");
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  const linkClass =
    "border border-charcoal-line px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-charcoal-ink hover:border-charcoal-ink";

  return (
    <div className="mt-6 flex items-center gap-4">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass}>
          Previous
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-40`}>Previous</span>
      )}
      <span className="text-sm text-charcoal-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={href(page + 1)} className={linkClass}>
          Next
        </Link>
      ) : (
        <span className={`${linkClass} pointer-events-none opacity-40`}>Next</span>
      )}
    </div>
  );
}

export function parsePage(raw: string | undefined) {
  const n = Number(raw);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
