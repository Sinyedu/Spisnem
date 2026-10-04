import { useEffect, useState } from "react";

const SECOND_MS = 1_000;
const SECONDS_PER_MINUTE = 60;

function formatClock(ms: number) {
  const totalSeconds = Math.ceil(ms / SECOND_MS);
  const minutes = Math.floor(totalSeconds / SECONDS_PER_MINUTE);
  const seconds = String(totalSeconds % SECONDS_PER_MINUTE).padStart(2, "0");
  return `${minutes}:${seconds}`;
}

/** "4:32" left to walk in, counting down to the deadline the restaurant set when calling. */
export function useGraceCountdown(graceUntil: string | null) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), SECOND_MS);
    return () => window.clearInterval(timer);
  }, []);

  if (!graceUntil) return null;
  const left = Math.max(0, Date.parse(graceUntil) - now);
  return { left: formatClock(left), expired: left === 0 };
}
