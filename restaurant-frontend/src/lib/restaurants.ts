import type { MapBounds, Restaurant, RestaurantFeatureCollection } from "../types/api";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

// Used until a restaurant uploads its own cover image.
export const RESTAURANT_PLACEHOLDER_IMAGE = "/images/restaurant-placeholder.svg";

// Restaurants inside the visible map area. See backend GET /api/public/restaurants/map.
export async function getRestaurantsInBounds(
  bounds: MapBounds,
  signal?: AbortSignal,
): Promise<RestaurantFeatureCollection> {
  const query = new URLSearchParams(
    Object.entries(bounds).map(([key, value]) => [key, String(value)]),
  );

  const response = await fetch(`${API_URL}/public/restaurants/map?${query}`, { signal });
  if (!response.ok) throw new Error(`restaurant map request failed (${response.status})`);
  return (await response.json()) as RestaurantFeatureCollection;
}

// One restaurant. See backend GET /api/public/restaurants/:slug.
export async function getRestaurant(slug: string, signal?: AbortSignal): Promise<Restaurant> {
  const response = await fetch(`${API_URL}/public/restaurants/${slug}`, { signal });
  if (!response.ok) throw new Error(`restaurant request failed (${response.status})`);
  const body = (await response.json()) as { data: Restaurant };
  return body.data;
}
