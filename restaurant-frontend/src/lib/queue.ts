import type { JoinedQueueEntry, QueueEntry, QueueJoinInput } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const QUEUE_TOKEN_KEY = "spisnem.queueToken";
export const QUEUE_TOKEN_CHANGED = "spisnem:queue-token-changed";

async function readData<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`queue request failed (${response.status})`);
  const body = (await response.json()) as { data: T };
  return body.data;
}

export async function joinRestaurantQueue(
  slug: string,
  input: QueueJoinInput,
): Promise<JoinedQueueEntry> {
  const response = await fetch(`${API_URL}/public/restaurants/${slug}/queue`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
  });
  return readData<JoinedQueueEntry>(response);
}

export async function getQueueEntry(token: string, signal?: AbortSignal) {
  const response = await fetch(`${API_URL}/public/queue/${token}`, { signal });
  return readData<QueueEntry>(response);
}

export async function cancelQueueEntry(token: string) {
  const response = await fetch(`${API_URL}/public/queue/${token}/cancel`, {
    method: "POST",
  });
  return readData<QueueEntry>(response);
}

export function readQueueToken() {
  return localStorage.getItem(QUEUE_TOKEN_KEY);
}

export function writeQueueToken(token: string) {
  localStorage.setItem(QUEUE_TOKEN_KEY, token);
  window.dispatchEvent(new Event(QUEUE_TOKEN_CHANGED));
}

export function clearQueueToken() {
  localStorage.removeItem(QUEUE_TOKEN_KEY);
  window.dispatchEvent(new Event(QUEUE_TOKEN_CHANGED));
}
