import { badRequest, notFound } from "../../shared/errors.js";
import { newId } from "../../shared/ids.js";
import { publishChange } from "../../shared/live-bus.js";
import { createPublicToken, hashPublicToken } from "../../shared/public-token.js";
import type { JoinQueueInput, PublicQueueEntry, QueueEntryDoc, RestaurantDoc, WaitEstimate } from "../../types/index.js";
import { toRestaurantSummary } from "../restaurants/restaurant.mapper.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";
import { getRestaurantDocBySlug } from "../restaurants/restaurant.service.js";
import { recordEvent } from "./queue-events.repository.js";
import { loadLine, placeInLine } from "./queue-line.js";
import { toQueueEntry } from "./queue.mapper.js";
import { currentPosition, moveToPosition } from "./queue-order.js";
import { findQueueEntryByTokenHash, insertQueueEntry, updateEntryIf } from "./queue.repository.js";
import { applyTransition } from "./queue-transitions.js";
import { estimateNewParty, minutesPerParty } from "./wait-estimator.js";

// A guest can push themselves back with "running late" this many times per visit.
export const MAX_LATE_REPORTS = 1;

// Staff may still add walk-ins while the queue is paused for app guests.
export function assertCanJoin(restaurant: RestaurantDoc, partySize: number, { allowPaused = false } = {}) {
  if (restaurant.queueState === "closed") throw badRequest("Queue is closed for this restaurant", "QUEUE_DISABLED");
  if (restaurant.queueState === "paused" && !allowPaused) throw badRequest("Queue is paused for a moment", "QUEUE_PAUSED");
  if (partySize > restaurant.maxPartySize) {
    throw badRequest(`Parties above ${restaurant.maxPartySize} should call the restaurant`, "PARTY_TOO_LARGE");
  }
}

async function toPublicEntry(entry: QueueEntryDoc, known?: RestaurantDoc): Promise<PublicQueueEntry> {
  const restaurant = known ?? (await findRestaurantById(entry.restaurantId));
  if (!restaurant) throw notFound("Restaurant not found");
  const line = await loadLine(restaurant);
  return {
    ...toQueueEntry(entry),
    ...placeInLine(line, entry),
    restaurant: toRestaurantSummary(restaurant),
    canReportLate: entry.status === "waiting" && entry.lateCount < MAX_LATE_REPORTS,
  };
}

export async function joinQueue(slug: string, input: JoinQueueInput, customerUserId: string | null) {
  const restaurant = await getRestaurantDocBySlug(slug);
  assertCanJoin(restaurant, input.partySize);
  const quote = estimateNewParty((await loadLine(restaurant)).snapshot, input.partySize).minutes;
  const { token, tokenHash } = createPublicToken();
  const now = new Date();
  const entry = await insertQueueEntry({
    _id: newId(), restaurantId: restaurant._id, guestName: input.guestName, phone: input.phone ?? null,
    partySize: input.partySize, notes: input.notes ?? null, status: "waiting", source: "app", tokenHash,
    customerUserId, sortKey: now.getTime(), quotedWaitMinutes: quote, quoteOverrideMinutes: null, tableId: null,
    lateCount: 0, joinedAt: now, notifiedAt: null, onMyWayAt: null, graceUntil: null, seatedAt: null,
    cancelledAt: null, noShowAt: null, updatedAt: now,
  });
  await recordEvent({ restaurantId: restaurant._id, entryId: entry._id, type: "joined", actor: "guest", data: { quote } });
  publishChange(restaurant._id, { kind: "queue", id: entry._id });
  // The plain token is returned once here and never stored.
  return { ...(await toPublicEntry(entry, restaurant)), token };
}

export async function loadEntryByToken(token: string) {
  const entry = await findQueueEntryByTokenHash(hashPublicToken(token));
  if (!entry) throw notFound("Queue entry not found");
  return entry;
}

export async function getQueueEntryByToken(token: string) {
  return toPublicEntry(await loadEntryByToken(token));
}

export async function cancelQueueEntryByToken(token: string) {
  const entry = await loadEntryByToken(token);
  const updated = await applyTransition(entry, "cancelled", { $set: { cancelledAt: new Date() } });
  await recordEvent({ restaurantId: entry.restaurantId, entryId: entry._id, type: "cancelled", actor: "guest" });
  publishChange(entry.restaurantId, { kind: "queue", id: entry._id });
  return toPublicEntry(updated);
}

// "Running late": move back by roughly as many parties as fit in the extra minutes.
export async function reportLate(token: string, minutes: number) {
  const entry = await loadEntryByToken(token);
  if (entry.status !== "waiting") throw badRequest("Only waiting guests can report running late", "NOT_WAITING");
  if (entry.lateCount >= MAX_LATE_REPORTS) throw badRequest("Running late was already used", "LATE_LIMIT");
  const restaurant = await findRestaurantById(entry.restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");
  const perParty = minutesPerParty((await loadLine(restaurant)).snapshot).minutes;
  const steps = Math.max(1, Math.round(minutes / perParty));
  const position = await moveToPosition(entry, (await currentPosition(entry)) + steps);
  await updateEntryIf(entry.restaurantId, entry._id, ["waiting"], { $inc: { lateCount: 1 } });
  await recordEvent({ restaurantId: entry.restaurantId, entryId: entry._id, type: "late", actor: "guest", data: { minutes, position } });
  publishChange(entry.restaurantId, { kind: "queue", id: entry._id });
  return getQueueEntryByToken(token);
}

export async function reportOnMyWay(token: string) {
  const entry = await loadEntryByToken(token);
  if (entry.status !== "notified") throw badRequest("You have not been called in yet", "NOT_CALLED");
  const updated = await updateEntryIf(entry.restaurantId, entry._id, ["notified"], { $set: { onMyWayAt: new Date() } });
  if (!updated) throw notFound("Queue entry not found");
  await recordEvent({ restaurantId: entry.restaurantId, entryId: entry._id, type: "on_my_way", actor: "guest" });
  publishChange(entry.restaurantId, { kind: "queue", id: entry._id });
  return toPublicEntry(updated);
}

export async function estimateWaitForSlug(slug: string, partySize: number): Promise<WaitEstimate> {
  const restaurant = await getRestaurantDocBySlug(slug);
  const estimate = estimateNewParty((await loadLine(restaurant)).snapshot, partySize);
  return {
    estimatedWaitMinutes: estimate.minutes,
    partiesAhead: estimate.partiesAhead,
    queueState: restaurant.queueState,
    basis: estimate.basis,
  };
}
