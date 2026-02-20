const MAX_ATTEMPTS = 5;
const WINDOW_DURATION_MS = 15 * 60 * 1000; // 15 minutes

interface AttemptRecord {
  timestamps: number[];
}

const attemptsMap = new Map<string, AttemptRecord>();

function cleanExpiredEntries(record: AttemptRecord): number[] {
  const now = Date.now();
  return record.timestamps.filter(
    (timestamp) => now - timestamp < WINDOW_DURATION_MS
  );
}

export function checkRateLimit(ipAddress: string): {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
} {
  const record = attemptsMap.get(ipAddress) ?? { timestamps: [] };
  const validTimestamps = cleanExpiredEntries(record);

  if (validTimestamps.length >= MAX_ATTEMPTS) {
    const oldestTimestamp = validTimestamps[0];
    const retryAfterMs = WINDOW_DURATION_MS - (Date.now() - oldestTimestamp);
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  return {
    allowed: true,
    remainingAttempts: MAX_ATTEMPTS - validTimestamps.length,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAttempt(ipAddress: string) {
  const record = attemptsMap.get(ipAddress) ?? { timestamps: [] };
  const validTimestamps = cleanExpiredEntries(record);
  validTimestamps.push(Date.now());
  attemptsMap.set(ipAddress, { timestamps: validTimestamps });
}

export function resetAttempts(ipAddress: string) {
  attemptsMap.delete(ipAddress);
}
