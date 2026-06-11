// Simple in-memory rate limiter (replace with Redis for production at scale)
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  ip: string,
  key: string,
  options: RateLimitOptions = { maxRequests: 5, windowMs: 60_000 }
): { allowed: boolean; remaining: number } {
  const cacheKey = `${ip}:${key}`;
  const now = Date.now();
  const entry = ipRequestMap.get(cacheKey);

  if (!entry || now > entry.resetAt) {
    ipRequestMap.set(cacheKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return { allowed: true, remaining: options.maxRequests - 1 };
  }

  if (entry.count >= options.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: options.maxRequests - entry.count };
}

// Clean up expired entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, value] of ipRequestMap.entries()) {
        if (now > value.resetAt) {
          ipRequestMap.delete(key);
        }
      }
    },
    5 * 60 * 1000
  );
}
