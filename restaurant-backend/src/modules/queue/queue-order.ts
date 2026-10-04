import { queueEntries } from "../../database/collections.js";
import type { QueueEntryDoc } from "../../types/index.js";
import { listActiveEntries } from "./queue.repository.js";

// New sort keys sit this far past the ends of the line (ms, same unit as join times).
const END_GAP = 1_000;

function keyBetween(before: QueueEntryDoc | undefined, after: QueueEntryDoc | undefined) {
  if (before && after) return (before.sortKey + after.sortKey) / 2;
  if (before) return before.sortKey + END_GAP;
  if (after) return after.sortKey - END_GAP;
  return Date.now();
}

/**
 * Puts a guest at a 1-based place in line by giving them a sort key between their new
 * neighbours. Nobody else's key changes, so other devices never see a reshuffle.
 */
export async function moveToPosition(entry: QueueEntryDoc, position: number) {
  const others = (await listActiveEntries([entry.restaurantId])).filter((other) => other._id !== entry._id);
  const index = Math.min(Math.max(position - 1, 0), others.length);
  const sortKey = keyBetween(others[index - 1], others[index]);
  await queueEntries.updateOne({ _id: entry._id }, { $set: { sortKey, updatedAt: new Date() } });
  return index + 1;
}

export async function currentPosition(entry: QueueEntryDoc) {
  const line = await listActiveEntries([entry.restaurantId]);
  return line.findIndex((other) => other._id === entry._id) + 1;
}
