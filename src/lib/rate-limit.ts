import "server-only";
import { headers } from "next/headers";

// In-memory sliding-window limiter. Good for a single server instance;
// swap for Redis/Upstash if the app ever runs on multi-instance serverless.
const buckets = new Map<string, number[]>();

const MAX_BUCKETS = 10_000; // memory backstop

function prune(now: number, windowMs: number, timestamps: number[]) {
  return timestamps.filter((t) => now - t < windowMs);
}

/**
 * Returns true when the call is allowed, false when rate-limited.
 * Records the attempt only when allowed=false is not yet reached.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): boolean {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, ts] of buckets) {
      if (prune(now, windowMs, ts).length === 0) buckets.delete(k);
    }
  }

  const timestamps = prune(now, windowMs, buckets.get(key) ?? []);
  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }
  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}

/** Best-effort client IP for rate-limit keys (proxy header, then fallback). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}
