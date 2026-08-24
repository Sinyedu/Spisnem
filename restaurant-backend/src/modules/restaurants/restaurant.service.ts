import { badRequest, notFound } from "../../shared/errors.js";
import type {
  MapBounds,
  RestaurantFeatureCollection,
  UpdateRestaurantProfileInput,
} from "../../types/index.js";
import {
  findActiveRestaurantBySlug,
  findRestaurantById,
  listActiveRestaurants,
  listActiveRestaurantsInBounds,
  updateRestaurantProfile,
} from "./restaurant.repository.js";

export function getRestaurants(search?: string) {
  return listActiveRestaurants(search ?? null);
}

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await findActiveRestaurantBySlug(slug);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function getStaffRestaurant(restaurantId: string) {
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");
  return restaurant;
}

export async function editStaffRestaurant(
  restaurantId: string,
  input: UpdateRestaurantProfileInput,
) {
  if (Object.keys(input).length === 0) {
    throw badRequest("No restaurant fields provided", "EMPTY_RESTAURANT_UPDATE");
  }

  const restaurant = await updateRestaurantProfile(restaurantId, input);
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
