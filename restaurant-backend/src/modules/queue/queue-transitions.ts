import type { UpdateFilter } from "mongodb";
import { conflict, notFound } from "../../shared/errors.js";
import { assertTransition, canTransition } from "../../shared/status.js";
import type { QueueEntryDoc, QueueStatus, TransitionMap } from "../../types/index.js";
import { findQueueEntryById, updateEntryIf } from "./queue.repository.js";

export const queueTransitions: TransitionMap<QueueStatus> = {
  waiting: ["notified", "seated", "cancelled"],
  notified: ["seated", "cancelled", "no_show"],
  seated: [],
  cancelled: [],
  no_show: [],
};

export function canChangeQueueStatus(from: QueueStatus, to: QueueStatus) {
  return canTransition(queueTransitions, from, to);
}

// Every status an entry may come from to reach `target`.
function statusesBefore(target: QueueStatus) {
  return (Object.keys(queueTransitions) as QueueStatus[]).filter((from) => queueTransitions[from].includes(target));
}

export async function loadEntry(restaurantId: string, id: string) {
  const entry = await findQueueEntryById(restaurantId, id);
  if (!entry) throw notFound("Queue entry not found");
  return entry;
}

/**
 * Moves an entry to `target` with the given extra changes. The friendly check gives a
 * clear 409; the conditional write catches the case where another device got there first.
 */
export async function applyTransition(
  entry: QueueEntryDoc,
  target: QueueStatus,
  update: UpdateFilter<QueueEntryDoc> = {},
) {
  assertTransition(queueTransitions, entry.status, target, "queue");
  const updated = await updateEntryIf(entry.restaurantId, entry._id, statusesBefore(target), {
    ...update,
    $set: { ...update.$set, status: target },
  });
  if (!updated) throw conflict("This guest was updated on another device", "QUEUE_ENTRY_CHANGED");
  return updated;
}
