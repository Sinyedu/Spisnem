import { useEffect, useState } from "react";
import type { QueueEntry } from "../../../types/api";

const TICK_MS = 30_000;
const MINUTE_MS = 60_000;

function elapsedMinutes(entry: QueueEntry, now: number) {
  return Math.max(0, Math.floor((now - Date.parse(entry.joinedAt)) / MINUTE_MS));
}

function remainingMinutes(entry: QueueEntry, now: number) {
  if (entry.estimatedWaitMinutes === null) return null;
  return Math.max(0, entry.estimatedWaitMinutes - elapsedMinutes(entry, now));
}

function ringProgress(entry: QueueEntry, remaining: number | null) {
  if (entry.estimatedWaitMinutes === null || remaining === null) return 0;
  const total = Math.max(1, entry.estimatedWaitMinutes);
  return Math.round((remaining / total) * 100);
}

export function useQueueCountdown(entry: QueueEntry) {
  const [now, setNow] = useState(() => Date.now());
  const remaining = remainingMinutes(entry, now);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), TICK_MS);
    return () => window.clearInterval(timer);
  }, [entry.id, entry.estimatedWaitMinutes, entry.joinedAt]);

  return {
    remainingMinutes: remaining,
    progress: ringProgress(entry, remaining),
  };
}
