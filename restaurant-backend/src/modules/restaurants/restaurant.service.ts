import { notFound } from "../../shared/errors.js";
import type {
  MapBounds,
  PublicRestaurant,
  RestaurantDoc,
  RestaurantFeatureCollection,
  RestaurantQueueInfo,
  UpdateRestaurantProfileInput,
  WaitSnapshot,
} from "../../types/index.js";
import { DEFAULT_QUOTE_PARTY_SIZE, loadSnapshots } from "../queue/wait-snapshot.js";
import { estimateNewParty } from "../queue/wait-estimator.js";
import { toRestaurant } from "./restaurant.mapper.js";
import { profileChanges } from "./restaurant.profile.js";
import {
  findActiveRestaurantBySlug,
  findRestaurantById,
  listActiveRestaurants,
  listActiveRestaurantsInBounds,
  updateRestaurant,
} from "./restaurant.repository.js";

export async function getRestaurants(search?: string) {
  return (await listActiveRestaurants(search ?? null)).map(toRestaurant);
}

export async function getRestaurantDocBySlug(slug: string) {
  const restaurant = await findActiveRestaurantBySlug(slug);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function getRestaurantBySlug(slug: string) {
  return toRestaurant(await getRestaurantDocBySlug(slug));
}

function queueInfo(snapshot: WaitSnapshot | undefined): RestaurantQueueInfo {
  if (!snapshot) return { partiesWaiting: 0, estimatedWaitMinutes: 0 };
  return {
    partiesWaiting: snapshot.queue.length,
    estimatedWaitMinutes: estimateNewParty(snapshot, DEFAULT_QUOTE_PARTY_SIZE).minutes,
  };
}

export async function getPublicRestaurant(slug: string): Promise<PublicRestaurant> {
  const doc = await getRestaurantDocBySlug(slug);
  const snapshots = await loadSnapshots([doc]);
  return { ...toRestaurant(doc), ...queueInfo(snapshots.get(doc._id)) };
}

function toFeature(doc: RestaurantDoc, snapshot: WaitSnapshot | undefined) {
  const restaurant = toRestaurant(doc);
  return {
    type: "Feature" as const,
    id: doc._id,
    geometry: { type: "Point" as const, coordinates: doc.location!.coordinates },
    properties: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug,
      cuisine: restaurant.cuisine,
      priceLevel: restaurant.priceLevel,
      heroImageUrl: restaurant.heroImageUrl,
      queueEnabled: restaurant.queueEnabled,
      queueState: restaurant.queueState,
      averageWaitMinutes: restaurant.averageWaitMinutes,
      ...queueInfo(snapshot),
    },
  };
}

export async function getRestaurantsInBounds(bounds: MapBounds): Promise<RestaurantFeatureCollection> {
  const docs = await listActiveRestaurantsInBounds(bounds);
  const snapshots = await loadSnapshots(docs);
  return {
    type: "FeatureCollection",
    features: docs.map((doc) => toFeature(doc, snapshots.get(doc._id))),
  };
}

async function getStaffRestaurantDoc(restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function getStaffRestaurant(restaurantId: string) {
  return toRestaurant(await getStaffRestaurantDoc(restaurantId));
}

export async function editStaffRestaurant(restaurantId: string, input: UpdateRestaurantProfileInput) {
  const current = await getStaffRestaurantDoc(restaurantId);
  const updated = await updateRestaurant(restaurantId, profileChanges(current, input));
  if (!updated) throw notFound("Restaurant not found");
  return toRestaurant(updated);
}
