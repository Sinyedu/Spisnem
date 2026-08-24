import { useEffect, useState } from "react";
import type { QueueEntry } from "../../../types/api";
import { getQueueEntry, QUEUE_TOKEN_CHANGED, readQueueToken } from "../../../lib/queue";

const POLL_MS = 20_000;

function isTrackable(entry: QueueEntry) {
  return entry.status === "waiting" || entry.status === "notified";
}

export function useQueueTracker() {
  const [entry, setEntry] = useState<QueueEntry | null>(null);
  const [token, setToken] = useState(() => readQueueToken());

  useEffect(() => {
    const onTokenChanged = () => setToken(readQueueToken());
    window.addEventListener(QUEUE_TOKEN_CHANGED, onTokenChanged);
    return () => window.removeEventListener(QUEUE_TOKEN_CHANGED, onTokenChanged);
  }, []);

  useEffect(() => {
    if (!token) {
      setEntry(null);
      return;
    }

    const controller = new AbortController();
    const load = () => {
      getQueueEntry(token, controller.signal)
        .then((next) => setEntry(isTrackable(next) ? next : null))
        .catch(() => setEntry(null));
    };

    load();
    const timer = window.setInterval(load, POLL_MS);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [token]);

  return entry;
}
