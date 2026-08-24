import { useEffect, useState } from "react";
import {
  cancelQueueEntry,
  clearQueueToken,
  getQueueEntry,
  joinRestaurantQueue,
  readQueueToken,
  writeQueueToken,
} from "../../lib/queue";
import type { QueueEntry, QueueJoinInput } from "../../types/api";

export function useQueuePage() {
  const [entry, setEntry] = useState<QueueEntry | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const token = readQueueToken();
    if (!token) return;

    const controller = new AbortController();
    getQueueEntry(token, controller.signal).then(setEntry).catch(clearQueueToken);
    return () => controller.abort();
  }, []);

  async function join(slug: string, input: QueueJoinInput) {
    setFailed(false);
    const joined = await joinRestaurantQueue(slug, input);
    writeQueueToken(joined.token);
    setEntry(joined);
  }

  async function leave() {
    const token = readQueueToken();
    if (token) await cancelQueueEntry(token);
    clearQueueToken();
    setEntry(null);
  }

  function markFailed() {
    setFailed(true);
  }

  return { entry, failed, join, leave, markFailed };
}
