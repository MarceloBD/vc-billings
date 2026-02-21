const DAILY_LIMIT = 100;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

interface DailyRecord {
  count: number;
  resetAt: number;
}

const dailyUsageMap = new Map<string, DailyRecord>();

function getOrCreateRecord(ipAddress: string): DailyRecord {
  const now = Date.now();
  const existing = dailyUsageMap.get(ipAddress);

  if (existing && now < existing.resetAt) {
    return existing;
  }

  const record: DailyRecord = { count: 0, resetAt: now + DAY_IN_MS };
  dailyUsageMap.set(ipAddress, record);
  return record;
}

export function checkDailyRateLimit(ipAddress: string): {
  allowed: boolean;
  remaining: number;
} {
  const record = getOrCreateRecord(ipAddress);

  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: DAILY_LIMIT - record.count };
}

export function recordDailyAction(ipAddress: string) {
  const record = getOrCreateRecord(ipAddress);
  record.count += 1;
  dailyUsageMap.set(ipAddress, record);
}
