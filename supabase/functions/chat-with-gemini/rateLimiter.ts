
interface UserRateLimit {
  userId: string;
  requestCount: number;
  windowStart: number;
  lastRequest: number;
}

const userLimits = new Map<string, UserRateLimit>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 20; // 20 requests per minute per user
const MIN_REQUEST_INTERVAL = 1000; // 1 second between requests

export const checkRateLimit = (userId: string): { allowed: boolean; message?: string } => {
  const now = Date.now();
  const userKey = userId || 'anonymous';
  
  let userLimit = userLimits.get(userKey);
  
  if (!userLimit) {
    userLimit = {
      userId: userKey,
      requestCount: 0,
      windowStart: now,
      lastRequest: 0
    };
    userLimits.set(userKey, userLimit);
  }
  
  // Reset window if expired
  if (now - userLimit.windowStart > RATE_LIMIT_WINDOW) {
    userLimit.requestCount = 0;
    userLimit.windowStart = now;
  }
  
  // Check minimum interval between requests
  if (now - userLimit.lastRequest < MIN_REQUEST_INTERVAL) {
    return {
      allowed: false,
      message: '⚡ খুব দ্রুত প্রশ্ন করছেন! ১ সেকেন্ড অপেক্ষা করুন।'
    };
  }
  
  // Check rate limit
  if (userLimit.requestCount >= MAX_REQUESTS_PER_MINUTE) {
    const remainingTime = Math.ceil((RATE_LIMIT_WINDOW - (now - userLimit.windowStart)) / 1000);
    return {
      allowed: false,
      message: `🚫 প্রতি মিনিটে ${MAX_REQUESTS_PER_MINUTE}টি প্রশ্নের সীমা! ${remainingTime} সেকেন্ড পর আবার চেষ্টা করুন।`
    };
  }
  
  // Update counters
  userLimit.requestCount++;
  userLimit.lastRequest = now;
  userLimits.set(userKey, userLimit);
  
  return { allowed: true };
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, limit] of userLimits.entries()) {
    if (now - limit.windowStart > RATE_LIMIT_WINDOW * 2) {
      userLimits.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW);
