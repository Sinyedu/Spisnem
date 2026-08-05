export function formatMoney(minor: number, currency = "DKK"): string {
  const value = minor / 100;
  const amount = Number.isInteger(value) ? String(value) : value.toFixed(2);
  return `${amount} ${currency}`;
}

export function formatRating(rating: number | null | undefined): string {
  return rating == null ? "–" : rating.toFixed(1);
}

export function formatWait(minutes: number | null | undefined): string {
  if (minutes == null) return "–";
  if (minutes <= 0) return "No wait";
  return `~${minutes} min`;
}

// Local persistence of the guest's active queue token, keyed by restaurant slug.
const queueKey = (slug: string) => `spisnem.queue.${slug}`;

export type StoredQueue = { token: string; slug: string; joinedAt: string };

export function storeQueueToken(entry: StoredQueue): void {
  localStorage.setItem(queueKey(entry.slug), JSON.stringify(entry));
}

export function readQueueToken(slug: string): StoredQueue | null {
  const raw = localStorage.getItem(queueKey(slug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredQueue;
  } catch {
    return null;
  }
}

export function clearQueueToken(slug: string): void {
  localStorage.removeItem(queueKey(slug));
}
