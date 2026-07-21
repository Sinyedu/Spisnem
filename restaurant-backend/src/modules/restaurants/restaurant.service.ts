import { notFound } from "../../shared/errors.js";
import { findActiveRestaurantBySlug, listActiveRestaurants } from "./restaurant.repository.js";

export function getRestaurants(search?: string) {
  return listActiveRestaurants(search ?? null);
}

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await findActiveRestaurantBySlug(slug);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}
