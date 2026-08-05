import { notFound } from "../../shared/errors.js";
import type { RestaurantDetail } from "../../types/index.js";
import { listActiveQueue } from "../queue/queue.repository.js";
import { findActiveRestaurantBySlug, listActiveRestaurants } from "./restaurant.repository.js";

export function getRestaurants(search?: string) {
  return listActiveRestaurants(search ?? null);
}

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await findActiveRestaurantBySlug(slug);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

// Public detail adds the current live queue snapshot so the app can show
// "N ahead" and an estimated wait before the guest joins.
export async function getRestaurantDetailBySlug(slug: string): Promise<RestaurantDetail> {
  const restaurant = await getRestaurantBySlug(slug);
  const queueLength = restaurant.queueEnabled
    ? (await listActiveQueue(restaurant.id)).length
    : 0;

  return {
    ...restaurant,
    queueLength,
    estimatedWaitMinutes: queueLength * restaurant.averageWaitMinutes,
  };
}
