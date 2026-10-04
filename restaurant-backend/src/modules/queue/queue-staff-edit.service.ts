import { badRequest, notFound } from "../../shared/errors.js";
import { publishChange } from "../../shared/live-bus.js";
import { definedFields } from "../../shared/objects.js";
import type { EditEntryInput, QueueEntryDoc, QueueSettingsInput, QueueStatus } from "../../types/index.js";
import { toRestaurant } from "../restaurants/restaurant.mapper.js";
import { updateRestaurant } from "../restaurants/restaurant.repository.js";
import { recordEvent } from "./queue-events.repository.js";
import { toQueueEntry } from "./queue.mapper.js";
import { moveToPosition } from "./queue-order.js";
import { ACTIVE_STATUSES, updateEntryIf } from "./queue.repository.js";
import { callEntry, cancelEntry, markNoShow, seatEntry } from "./queue-staff.service.js";
import { loadEntry } from "./queue-transitions.js";

function detailChanges(input: EditEntryInput): Partial<QueueEntryDoc> {
  const changes: Partial<QueueEntryDoc> = {};
  if (input.guestName !== undefined) changes.guestName = input.guestName;
  if (input.partySize !== undefined) changes.partySize = input.partySize;
  if (input.notes !== undefined) changes.notes = input.notes;
  if (input.quotedWaitMinutes !== undefined) changes.quoteOverrideMinutes = input.quotedWaitMinutes;
  return changes;
}

async function logEdits(entry: QueueEntryDoc, input: EditEntryInput, staffUserId: string, position: number | null) {
  const base = { restaurantId: entry.restaurantId, entryId: entry._id, actor: "staff" as const, staffUserId };
  if (position !== null) await recordEvent({ ...base, type: "reordered", data: { position } });
  if (input.quotedWaitMinutes !== undefined) {
    await recordEvent({ ...base, type: "quote_changed", data: { minutes: input.quotedWaitMinutes } });
  }
}

/** Name, party size, notes, a hand-typed wait, or a new place in line. */
export async function editEntry(restaurantId: string, id: string, input: EditEntryInput, staffUserId: string) {
  const entry = await loadEntry(restaurantId, id);
  if (!ACTIVE_STATUSES.includes(entry.status)) throw badRequest("Only guests still in line can be edited", "NOT_ACTIVE");
  const position = input.position !== undefined ? await moveToPosition(entry, input.position) : null;
  const updated = await updateEntryIf(restaurantId, id, ACTIVE_STATUSES, { $set: detailChanges(input) });
  if (!updated) throw notFound("Queue entry not found");
  await logEdits(entry, input, staffUserId, position);
  publishChange(restaurantId, { kind: "queue", id });
  return toQueueEntry(updated);
}

/**
 * The original PATCH /:id/status, kept so the dashboard keeps working. Each status
 * goes through the same action the newer endpoints use, timestamps and diary included.
 */
export function changeQueueStatus(restaurantId: string, id: string, status: QueueStatus, staffUserId: string) {
  if (status === "notified") return callEntry(restaurantId, id, staffUserId);
  if (status === "seated") return seatEntry(restaurantId, id, null, staffUserId);
  if (status === "no_show") return markNoShow(restaurantId, id, staffUserId);
  if (status === "cancelled") return cancelEntry(restaurantId, id, staffUserId);
  throw badRequest("A guest cannot be moved back to waiting", "INVALID_STATUS_CHANGE");
}

export async function updateQueueSettings(restaurantId: string, input: QueueSettingsInput) {
  const updated = await updateRestaurant(restaurantId, definedFields(input));
  if (!updated) throw notFound("Restaurant not found");
  publishChange(restaurantId, { kind: "settings", id: null });
  return toRestaurant(updated);
}
