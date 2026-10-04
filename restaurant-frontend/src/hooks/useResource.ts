import { useEffect, useState } from "react";

type ResourceResult<T> = { key: string; data: T | null; failed: boolean };

/**
 * Loads something for a key (a slug, a party size…) and forgets it when the key changes.
 * An empty key means "don't load". The loader is called with an AbortSignal.
 */
export function useResource<T>(key: string, load: (signal: AbortSignal) => Promise<T>) {
  const [result, setResult] = useState<ResourceResult<T> | null>(null);

  useEffect(() => {
    if (!key) return;
    const controller = new AbortController();
    load(controller.signal)
      .then((data) => setResult({ key, data, failed: false }))
      .catch((error) => {
        if (controller.signal.aborted) return;
        console.error(`[${key}]`, error);
        setResult({ key, data: null, failed: true });
      });
    return () => controller.abort();
    // The key identifies the request; a new loader function for the same key is not a new request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = result?.key === key ? result : null;
  return { data: current?.data ?? null, failed: current?.failed ?? false, loading: Boolean(key) && !current };
}
