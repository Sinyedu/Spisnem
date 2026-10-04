import type { LineEstimate, QueueEntryDoc, QueuePlace, RestaurantDoc, WaitSnapshot } from "../../types/index.js";
import { estimateLine } from "./wait-estimator.js";
import { loadSnapshots } from "./wait-snapshot.js";

export type QueueLine = {
  snapshot: WaitSnapshot;
  estimate: LineEstimate;
};

/** The restaurant's line right now, with a wait for every guest in it. */
export async function loadLine(restaurant: RestaurantDoc): Promise<QueueLine> {
  const snapshot = (await loadSnapshots([restaurant])).get(restaurant._id)!;
  return { snapshot, estimate: estimateLine(snapshot) };
}

export function placeInLine(line: QueueLine, entry: QueueEntryDoc): QueuePlace {
  const index = line.snapshot.queue.findIndex((party) => party.id === entry._id);
  if (index < 0) return { position: null, estimatedWaitMinutes: null };
  return { position: index + 1, estimatedWaitMinutes: line.estimate.minutes[index] ?? null };
}
