import { queueEvents } from "../../database/collections.js";
import { newId } from "../../shared/ids.js";
import type { QueueEventDoc } from "../../types/index.js";

export type NewQueueEvent = Omit<QueueEventDoc, "_id" | "at" | "tableId" | "staffUserId" | "data"> &
  Partial<Pick<QueueEventDoc, "tableId" | "staffUserId" | "data">>;

/** Writes one line in the queue diary. The estimate and insights read these back. */
export async function recordEvent(event: NewQueueEvent) {
  await queueEvents.insertOne({
    _id: newId(),
    at: new Date(),
    tableId: null,
    staffUserId: null,
    data: {},
    ...event,
  });
}

// Parties seated per restaurant since a moment: the "recent pace" of the estimate.
export async function countSeatingsSince(restaurantIds: string[], since: Date) {
  const rows = await queueEvents
    .aggregate<{ _id: string; count: number }>([
      { $match: { restaurantId: { $in: restaurantIds }, type: "seated", at: { $gte: since } } },
      { $group: { _id: "$restaurantId", count: { $sum: 1 } } },
    ])
    .toArray();
  return new Map(rows.map((row) => [row._id, row.count]));
}

// How long tables stayed occupied, averaged per restaurant, with the number of samples.
export async function averageTableTurns(restaurantIds: string[], since: Date) {
  const rows = await queueEvents
    .aggregate<{ _id: string; minutes: number; samples: number }>([
      { $match: { restaurantId: { $in: restaurantIds }, type: "table_freed", at: { $gte: since } } },
      { $group: { _id: "$restaurantId", minutes: { $avg: "$data.minutes" }, samples: { $sum: 1 } } },
    ])
    .toArray();
  return new Map(rows.map((row) => [row._id, row]));
}
