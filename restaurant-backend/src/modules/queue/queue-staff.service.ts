import { badRequest, conflict, notFound } from "../../shared/errors.js";
import { newId } from "../../shared/ids.js";
import { publishChange } from "../../shared/live-bus.js";
import { createPublicToken } from "../../shared/public-token.js";
import { addMinutes, minutesBetween } from "../../shared/time.js";
import type { QueueEntryDoc, StaffQueueEntry, WalkInInput } from "../../types/index.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";
import { occupyTable, updateTable } from "../tables/tables.repository.js";
import { recordEvent } from "./queue-events.repository.js";
import { loadLine, placeInLine } from "./queue-line.js";
import { toQueueEntry } from "./queue.mapper.js";
import { insertQueueEntry, listActiveEntries, updateEntryIf } from "./queue.repository.js";
import { assertCanJoin } from "./queue.service.js";
import { applyTransition, loadEntry } from "./queue-transitions.js";
import { estimateNewParty } from "./wait-estimator.js";

// Name shown for walk-ins who didn't give one.
const WALK_IN_NAME = "Walk-in";
// Default extra time when the host extends a called guest's grace period.
export const DEFAULT_EXTEND_MINUTES = 5;

export async function loadStaffRestaurant(restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function getStaffQueue(restaurantId: string): Promise<StaffQueueEntry[]> {
  const restaurant = await loadStaffRestaurant(restaurantId);
  const [line, entries] = await Promise.all([loadLine(restaurant), listActiveEntries([restaurantId])]);
  const now = new Date();
  return entries.map((entry) => ({
    ...toQueueEntry(entry),
    ...placeInLine(line, entry),
    waitedMinutes: minutesBetween(entry.joinedAt, now),
  }));
}

function staffEvent(entry: QueueEntryDoc, staffUserId: string) {
  return { restaurantId: entry.restaurantId, entryId: entry._id, actor: "staff" as const, staffUserId };
}

function announce(entry: QueueEntryDoc) {
  publishChange(entry.restaurantId, { kind: "queue", id: entry._id });
  return toQueueEntry(entry);
}

export async function addWalkIn(restaurantId: string, input: WalkInInput, staffUserId: string) {
  const restaurant = await loadStaffRestaurant(restaurantId);
  assertCanJoin(restaurant, input.partySize, { allowPaused: true });
  const estimate = estimateNewParty((await loadLine(restaurant)).snapshot, input.partySize).minutes;
  const now = new Date();
  const entry = await insertQueueEntry({
    _id: newId(), restaurantId, guestName: input.guestName?.trim() || WALK_IN_NAME, phone: input.phone ?? null,
    partySize: input.partySize, notes: input.notes ?? null, status: "waiting", source: "walk_in",
    tokenHash: createPublicToken().tokenHash, customerUserId: null, sortKey: now.getTime(),
    quotedWaitMinutes: input.quotedWaitMinutes ?? estimate, quoteOverrideMinutes: input.quotedWaitMinutes ?? null,
    tableId: null, lateCount: 0, joinedAt: now, notifiedAt: null, onMyWayAt: null, graceUntil: null,
    seatedAt: null, cancelledAt: null, noShowAt: null, updatedAt: now,
  });
  await recordEvent({ ...staffEvent(entry, staffUserId), type: "joined", data: { quote: entry.quotedWaitMinutes } });
  return announce(entry);
}

export async function callEntry(restaurantId: string, id: string, staffUserId: string) {
  const restaurant = await loadStaffRestaurant(restaurantId);
  const entry = await loadEntry(restaurantId, id);
  const now = new Date();
  const updated = await applyTransition(entry, "notified", {
    $set: { notifiedAt: now, graceUntil: addMinutes(now, restaurant.graceMinutes) },
  });
  await recordEvent({ ...staffEvent(entry, staffUserId), type: "called" });
  return announce(updated);
}

async function claimTable(restaurantId: string, tableId: string, entry: QueueEntryDoc) {
  const table = await occupyTable(restaurantId, tableId, entry._id, entry.partySize);
  if (!table) throw conflict("That table is not free", "TABLE_NOT_FREE");
}

export async function seatEntry(restaurantId: string, id: string, tableId: string | null, staffUserId: string) {
  const entry = await loadEntry(restaurantId, id);
  if (tableId) await claimTable(restaurantId, tableId, entry);
  const now = new Date();
  try {
    const updated = await applyTransition(entry, "seated", { $set: { seatedAt: now, tableId } });
    const waited = minutesBetween(entry.joinedAt, entry.notifiedAt ?? now);
    await recordEvent({ ...staffEvent(entry, staffUserId), tableId, type: "seated", data: { waited, quote: entry.quotedWaitMinutes } });
    if (tableId) publishChange(restaurantId, { kind: "tables", id: tableId });
    return announce(updated);
  } catch (error) {
    // The guest changed meanwhile; give the table back so it isn't stuck as seated.
    if (tableId) await updateTable(restaurantId, tableId, { status: "free", seatedAt: null, entryId: null, partySize: null });
    throw error;
  }
}

export async function markNoShow(restaurantId: string, id: string, staffUserId: string) {
  const entry = await loadEntry(restaurantId, id);
  const updated = await applyTransition(entry, "no_show", { $set: { noShowAt: new Date() } });
  await recordEvent({ ...staffEvent(entry, staffUserId), type: "no_show" });
  return announce(updated);
}

export async function cancelEntry(restaurantId: string, id: string, staffUserId: string) {
  const entry = await loadEntry(restaurantId, id);
  const updated = await applyTransition(entry, "cancelled", { $set: { cancelledAt: new Date() } });
  await recordEvent({ ...staffEvent(entry, staffUserId), type: "cancelled" });
  return announce(updated);
}

export async function extendGrace(restaurantId: string, id: string, minutes: number, staffUserId: string) {
  const entry = await loadEntry(restaurantId, id);
  if (entry.status !== "notified") throw badRequest("Only called guests have a grace period", "NOT_CALLED");
  const from = entry.graceUntil && entry.graceUntil > new Date() ? entry.graceUntil : new Date();
  const updated = await updateEntryIf(restaurantId, id, ["notified"], { $set: { graceUntil: addMinutes(from, minutes) } });
  if (!updated) throw conflict("This guest was updated on another device", "QUEUE_ENTRY_CHANGED");
  await recordEvent({ ...staffEvent(entry, staffUserId), type: "extended", data: { minutes } });
  return announce(updated);
}

