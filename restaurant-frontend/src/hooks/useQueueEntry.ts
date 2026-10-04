import { useCallback, useEffect, useState } from "react";
import { getQueueEntry, QUEUE_TOKEN_CHANGED, readQueueToken, subscribeToQueueEntry } from "../lib/queue";
import type { QueueEntry } from "../types/api";

// Only used when the live stream can't be kept open.
const POLL_MS = 20_000;

type EntryResult = { token: string | null; entry: QueueEntry | null };
type SetResult = (result: EntryResult) => void;

function useQueueToken() {
  const [token, setToken] = useState(() => readQueueToken());
  useEffect(() => {
    const onTokenChanged = () => setToken(readQueueToken());
    window.addEventListener(QUEUE_TOKEN_CHANGED, onTokenChanged);
    return () => window.removeEventListener(QUEUE_TOKEN_CHANGED, onTokenChanged);
  }, []);
  return token;
}

// Polls the ticket; used as the fallback when the live stream drops.
function startPolling(token: string, setResult: SetResult, signal: AbortSignal) {
  const load = () => {
    getQueueEntry(token, signal)
      .then((entry) => setResult({ token, entry }))
      .catch(() => !signal.aborted && setResult({ token, entry: null }));
  };
  load();
  const timer = window.setInterval(load, POLL_MS);
  signal.addEventListener("abort", () => window.clearInterval(timer));
}

function useLiveEntry(token: string | null) {
  const [result, setResult] = useState<EntryResult>({ token: null, entry: null });
  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    const close = subscribeToQueueEntry(
      token,
      (entry) => setResult({ token, entry }),
      () => {
        close();
        startPolling(token, setResult, controller.signal);
      },
    );
    return () => {
      close();
      controller.abort();
    };
  }, [token]);
  return { result, setResult };
}

/** The guest's current queue entry, pushed live by the server while a token is stored. */
export function useQueueEntry() {
  const token = useQueueToken();
  const { result, setResult } = useLiveEntry(token);
  // Store an entry we already have (e.g. straight after joining) without waiting for the stream.
  const setEntry = useCallback((entry: QueueEntry | null) => setResult({ token: readQueueToken(), entry }), [setResult]);
  const fresh = token !== null && result.token === token;
  return { entry: fresh ? result.entry : null, loading: token !== null && !fresh, setEntry };
}
