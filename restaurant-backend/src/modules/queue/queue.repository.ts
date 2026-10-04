import type { Filter, UpdateFilter } from "mongodb";
import { queueEntries } from "../../database/collections.js";
import type { QueueEntryDoc, QueueStatus } from "../../types/index.js";

// Guests still in line: waiting, or called and walking in.
export const ACTIVE_STATUSES: QueueStatus[] = ["waiting", "notified"];

export async function insertQueueEntry(entry: QueueEntryDoc) {
  await queueEntries.insertOne(entry);
  return entry;
}

export function findQueueEntryByTokenHash(tokenHash: string) {
  return queueEntries.findOne({ tokenHash });
}

export function findQueueEntryById(restaurantId: string, id: string) {
  return queueEntries.findOne({ _id: id, restaurantId });
}

// Active guests of one or more restaurants, in line order.
export function listActiveEntries(restaurantIds: string[]) {
  return queueEntries
    .find({ restaurantId: { $in: restaurantIds }, status: { $in: ACTIVE_STATUSES } })
    .sort({ sortKey: 1 })
    .toArray();
}

/**
 * Changes an entry only if it is still in one of the expected statuses. The check and
 * the write are one atomic operation, so two devices can't both seat the same guest.
 */
export function updateEntryIf(
  restaurantId: string,
  id: string,
  expected: QueueStatus[],
  update: UpdateFilter<QueueEntryDoc>,
) {
  const filter: Filter<QueueEntryDoc> = { _id: id, restaurantId, status: { $in: expected } };
  return queueEntries.findOneAndUpdate(
    filter,
    { ...update, $set: { ...update.$set, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export function listEntriesJoinedBetween(restaurantId: string, from: Date, to: Date) {
  return queueEntries.find({ restaurantId, joinedAt: { $gte: from, $lt: to } }).toArray();
}

export function listCustomerEntries(customerUserId: string, limit: number) {
  return queueEntries.find({ customerUserId }).sort({ joinedAt: -1 }).limit(limit).toArray();
}

export function countSeatedSince(restaurantId: string, since: Date) {
  return queueEntries.countDocuments({ restaurantId, status: "seated", seatedAt: { $gte: since } });
}
