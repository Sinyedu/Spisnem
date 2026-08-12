import { notFound } from "../../shared/errors.js";
import type { MapBounds, RestaurantFeatureCollection } from "../../types/index.js";
import {
  findActiveRestaurantBySlug,
  listActiveRestaurants,
  listActiveRestaurantsInBounds,
} from "./restaurant.repository.js";

export function getRestaurants(search?: string) {
  return listActiveRestaurants(search ?? null);
}

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await findActiveRestaurantBySlug(slug);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function getRestaurantsInBounds(bounds: MapBounds): Promise<RestaurantFeatureCollection> {
  const restaurants = await listActiveRestaurantsInBounds(bounds);

  return {
    type: "FeatureCollection",
    features: restaurants.map(({ latitude, longitude, ...properties }) => ({
      type: "Feature",
      id: properties.id,
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties,
    })),
  };
}
