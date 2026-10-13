// Sliding-window in-memory fallback rate limiter
const memoryStore = new Map<string, number[]>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
    setInterval(() => {
        const now = Date.now();
        for (const [ip, timestamps] of memoryStore.entries()) {
            const valid = timestamps.filter((t) => now - t < 60000);
            if (valid.length === 0) {
                memoryStore.delete(ip);
            } else {
                memoryStore.set(ip, valid);
            }
        }
    }, 5 * 60 * 1000);
}

/**
 * Checks if the request from clientIp exceeds maxRequests within windowMs.
 * Supports Upstash Redis REST API if UPSTASH_REDIS_REST_URL is configured,
 * otherwise falls back to sliding-window in-memory rate limiting.
 */
export async function checkRateLimit(
    clientIp: string,
    maxRequests = 3,
    windowMs = 60000
): Promise<{ success: boolean; remaining: number }> {
    const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
    const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

    // Upstash Serverless REST API check (if credentials provided)
    if (upstashUrl && upstashToken) {
        try {
            const key = `ratelimit:${clientIp}`;
            const res = await fetch(`${upstashUrl}/incr/${key}`, {
                headers: { Authorization: `Bearer ${upstashToken}` },
            });
            const data = await res.json();
            const currentCount = data.result;

            if (currentCount === 1) {
                // Set TTL
                await fetch(`${upstashUrl}/expire/${key}/${Math.ceil(windowMs / 1000)}`, {
                    headers: { Authorization: `Bearer ${upstashToken}` },
                });
            }

            if (currentCount > maxRequests) {
                return { success: false, remaining: 0 };
            }
            return { success: true, remaining: maxRequests - currentCount };
        } catch (err) {
            console.error("[RateLimit] Eroare Upstash Redis, se foloseste fallback-ul in-memory:", err);
        }
    }

    // Robust In-Memory Sliding Window Fallback
    const now = Date.now();
    const timestamps = memoryStore.get(clientIp) || [];
    const validTimestamps = timestamps.filter((t) => now - t < windowMs);

    if (validTimestamps.length >= maxRequests) {
        return { success: false, remaining: 0 };
    }

    validTimestamps.push(now);
    memoryStore.set(clientIp, validTimestamps);
    return { success: true, remaining: maxRequests - validTimestamps.length };
}
