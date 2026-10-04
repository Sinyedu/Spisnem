import type { WaitEstimate, WaitSource } from "../types/wait";

/** The server's live estimate for joining now, or why the queue can't be joined. */
export function estimateWait(source: WaitSource): WaitEstimate {
  if (source.queueState !== "open") return { open: false, state: source.queueState };
  return { open: true, minutes: source.estimatedWaitMinutes, partiesAhead: source.partiesWaiting };
}

// Sort key: open queues first, shortest wait first. Others sink to the bottom.
export function waitSortKey(source: WaitSource) {
  const wait = estimateWait(source);
  return wait.open ? wait.minutes : Number.POSITIVE_INFINITY;
}

export function priceLabel(priceLevel: number | null) {
  return priceLevel ? "$".repeat(priceLevel) : null;
}
