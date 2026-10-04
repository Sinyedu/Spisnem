import { notFound } from "../../shared/errors.js";
import type { CustomerVisit, FavouriteRestaurant, RestaurantDoc } from "../../types/index.js";
import { actualWaitMinutes } from "../insights/insights.calculator.js";
import { listCustomerEntries } from "../queue/queue.repository.js";
import { toRestaurantSummary } from "../restaurants/restaurant.mapper.js";
import { findRestaurantById, findRestaurantsByIds } from "../restaurants/restaurant.repository.js";
import { addFavourite, listFavourites, removeFavourite } from "./customer.repository.js";

// History shows the most recent visits only.
const VISIT_HISTORY_LIMIT = 30;

async function restaurantsById(ids: string[]) {
  const docs = await findRestaurantsByIds([...new Set(ids)]);
  return new Map<string, RestaurantDoc>(docs.map((doc) => [doc._id, doc]));
}

export async function getFavourites(customerUserId: string): Promise<FavouriteRestaurant[]> {
  const saved = await listFavourites(customerUserId);
  const restaurants = await restaurantsById(saved.map((favourite) => favourite.restaurantId));
  return saved.flatMap((favourite) => {
    const restaurant = restaurants.get(favourite.restaurantId);
    if (!restaurant?.isActive) return [];
    return [{
      ...toRestaurantSummary(restaurant),
      cuisine: restaurant.cuisine,
      heroImageUrl: restaurant.heroImageUrl,
      addedAt: favourite.createdAt.toISOString(),
    }];
  });
}

export async function saveFavourite(customerUserId: string, restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant?.isActive) throw notFound("Restaurant not found");
  await addFavourite(customerUserId, restaurantId);
}

export function deleteFavourite(customerUserId: string, restaurantId: string) {
  return removeFavourite(customerUserId, restaurantId);
}

export async function getVisits(customerUserId: string): Promise<CustomerVisit[]> {
  const entries = await listCustomerEntries(customerUserId, VISIT_HISTORY_LIMIT);
  const restaurants = await restaurantsById(entries.map((entry) => entry.restaurantId));
  return entries.flatMap((entry) => {
    const restaurant = restaurants.get(entry.restaurantId);
    if (!restaurant) return [];
    return [{
      id: entry._id,
      status: entry.status,
      partySize: entry.partySize,
      joinedAt: entry.joinedAt.toISOString(),
      quotedWaitMinutes: entry.quotedWaitMinutes,
      actualWaitMinutes: actualWaitMinutes(entry),
      restaurant: toRestaurantSummary(restaurant),
    }];
  });
}
