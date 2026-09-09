type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now >= entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (entry.count >= max) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }
  entry.count += 1;
  return { allowed: true, retryAfterSec: 0 };
}

/** Prefer x-real-ip; use last XFF hop only as fallback (not the spoofable first hop). */
export function rateLimitKey(
  headers: Headers,
  scope: string,
  userId?: string | null
): string {
  if (userId) return `${scope}:user:${userId}`;
  const realIp = headers.get("x-real-ip")?.trim();
  const forwarded = headers.get("x-forwarded-for");
  const lastHop = forwarded?.split(",").pop()?.trim();
  const ip = realIp || lastHop || "unknown";
  return `${scope}:ip:${ip}`;
}

export function clientIpFromHeaders(
  headers: Headers,
  fallback = "unknown"
): string {
  const realIp = headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  const forwarded = headers.get("x-forwarded-for");
  const lastHop = forwarded?.split(",").pop()?.trim();
  return lastHop || fallback;
}
