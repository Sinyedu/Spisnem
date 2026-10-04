import { useEffect, useState } from "react";
import type { QueueEntry } from "../types/api";

const TICK_MS = 30_000;
const MINUTE_MS = 60_000;
// Below this many minutes the ticket says "any moment now" instead of a number.
export const ALMOST_MINUTES = 2;

function elapsedMinutes(entry: QueueEntry, now: number) {
  return Math.max(0, (now - Date.parse(entry.joinedAt)) / MINUTE_MS);
}

/**
 * The server's estimate is already "minutes from now" (parties ahead × average turn),
 * so it is shown as-is. The ring fills with the share of the total wait already behind you.
 */
export function useQueueCountdown(entry: QueueEntry) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [entry.id, entry.estimatedWaitMinutes]);

  const remaining = entry.estimatedWaitMinutes;
  if (remaining === null) return { remainingMinutes: null, progress: 0 };

  const elapsed = elapsedMinutes(entry, now);
  const total = elapsed + remaining;
  const progress = total === 0 ? 1 : elapsed / total;
  return { remainingMinutes: remaining, progress };
}
