import { badRequest, notFound } from "../../shared/errors.js";
import { createPublicToken, hashPublicToken } from "../../shared/public-token.js";
import { assertTransition, canTransition } from "../../shared/status.js";
import type {
  JoinQueueInput,
  QueueEntry,
  QueuePlace,
  QueueStatus,
  Restaurant,
  TransitionMap,
} from "../../types/index.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";
import { getRestaurantBySlug } from "../restaurants/restaurant.service.js";
import {
  countAheadInQueue,
  findQueueEntryById,
  findQueueEntryByTokenHash,
  insertQueueEntry,
  listActiveQueue,
  updateQueueEntryStatus,
} from "./queue.repository.js";

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

async function placeInQueue(entry: QueueEntry, averageWaitMinutes: number): Promise<QueuePlace> {
  if (entry.status !== "waiting" && entry.status !== "notified") {
    return { position: null, estimatedWaitMinutes: null };
  }

  const position = (await countAheadInQueue(entry.restaurantId, entry.joinedAt)) + 1;
  return { position, estimatedWaitMinutes: (position - 1) * averageWaitMinutes };
}

async function toPublicEntry(entry: QueueEntry, restaurant: Restaurant) {
  return {
    ...entry,
    ...(await placeInQueue(entry, restaurant.averageWaitMinutes)),
    restaurant: { id: restaurant.id, name: restaurant.name, slug: restaurant.slug },
  };
}

export async function joinQueue(slug: string, input: JoinQueueInput) {
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant.queueEnabled) {
    throw badRequest("Queue is closed for this restaurant", "QUEUE_DISABLED");
  }

  const { token, tokenHash } = createPublicToken();
  const entry = await insertQueueEntry(restaurant.id, input, tokenHash);

  // The plain token is returned once here and never stored.
  return { ...(await toPublicEntry(entry, restaurant)), token };
}

async function loadEntryByToken(token: string) {
  const entry = await findQueueEntryByTokenHash(hashPublicToken(token));
  if (!entry) throw notFound("Queue entry not found");
  return entry;
}

export async function getQueueEntryByToken(token: string) {
  const entry = await loadEntryByToken(token);

  const restaurant = await findRestaurantById(entry.restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");

  return toPublicEntry(entry, restaurant);
}

export async function cancelQueueEntryByToken(token: string) {
  const entry = await loadEntryByToken(token);
  return applyQueueStatus(entry, "cancelled");
}

export async function getStaffQueue(restaurantId: string) {
  const entries = await listActiveQueue(restaurantId);
  return entries.map((entry, index) => ({ ...entry, position: index + 1 }));
}

export async function changeQueueStatus(
  restaurantId: string,
  id: string,
  status: QueueStatus,
) {
  const entry = await findQueueEntryById(restaurantId, id);
  if (!entry) throw notFound("Queue entry not found");
  return applyQueueStatus(entry, status);
}

async function applyQueueStatus(entry: QueueEntry, status: QueueStatus) {
  assertTransition(queueTransitions, entry.status, status, "queue");

  const updated = await updateQueueEntryStatus(entry.restaurantId, entry.id, status);
  if (!updated) throw notFound("Queue entry not found");
  return updated;
}
