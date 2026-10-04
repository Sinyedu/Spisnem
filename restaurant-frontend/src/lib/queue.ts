import { API_URL } from "../config/env";
import type { JoinedQueueEntry, LateMinutes, QueueEntry, QueueJoinInput, WaitEstimate } from "../types/api";
import { apiRequest } from "./http";

const QUEUE_TOKEN_KEY = "spisnem.queueToken";
export const QUEUE_TOKEN_CHANGED = "spisnem:queue-token-changed";

// Signed-in guests send their session so the visit lands in their history.
export function joinRestaurantQueue(slug: string, input: QueueJoinInput) {
  return apiRequest<JoinedQueueEntry>(`/public/restaurants/${slug}/queue`, { method: "POST", body: input, withSession: true });
}

export function getWaitEstimate(slug: string, partySize: number, signal?: AbortSignal) {
  return apiRequest<WaitEstimate>(`/public/restaurants/${slug}/queue/estimate?partySize=${partySize}`, { signal });
}

export function getQueueEntry(token: string, signal?: AbortSignal) {
  return apiRequest<QueueEntry>(`/public/queue/${token}`, { signal });
}

export function cancelQueueEntry(token: string) {
  return apiRequest<QueueEntry>(`/public/queue/${token}/cancel`, { method: "POST" });
}

export function reportRunningLate(token: string, minutes: LateMinutes) {
  return apiRequest<QueueEntry>(`/public/queue/${token}/late`, { method: "POST", body: { minutes } });
}

export function reportOnMyWay(token: string) {
  return apiRequest<QueueEntry>(`/public/queue/${token}/on-my-way`, { method: "POST" });
}

/** Live ticket updates (server-sent events). Returns a function that closes the stream. */
export function subscribeToQueueEntry(token: string, onEntry: (entry: QueueEntry) => void, onError: () => void) {
  const source = new EventSource(`${API_URL}/public/queue/${token}/stream`);
  source.addEventListener("entry", (event) => onEntry(JSON.parse((event as MessageEvent<string>).data) as QueueEntry));
  source.onerror = onError;
  return () => source.close();
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
