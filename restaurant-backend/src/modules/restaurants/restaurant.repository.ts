import type { Filter } from "mongodb";
import { restaurants } from "../../database/collections.js";
import { escapeRegex } from "../../shared/text.js";
import type { MapBounds, RestaurantDoc } from "../../types/index.js";

export async function listActiveRestaurants(search: string | null) {
  const filter: Filter<RestaurantDoc> = { isActive: true };
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [{ name: pattern }, { city: pattern }];
  }
  return restaurants.find(filter).sort({ name: 1 }).toArray();
}

export function findActiveRestaurantBySlug(slug: string) {
  return restaurants.findOne({ slug, isActive: true });
}

export function findRestaurantById(id: string) {
  return restaurants.findOne({ _id: id });
}

export function findRestaurantsByIds(ids: string[]) {
  return restaurants.find({ _id: { $in: ids } }).toArray();
}

// The visible map area as a polygon, so the 2dsphere index on location is used.
function boundsPolygon(bounds: MapBounds) {
  const { west, south, east, north } = bounds;
  return {
    type: "Polygon" as const,
    coordinates: [[[west, south], [east, south], [east, north], [west, north], [west, south]]],
  };
}

export function listActiveRestaurantsInBounds(bounds: MapBounds) {
  return restaurants
    .find({ isActive: true, location: { $geoWithin: { $geometry: boundsPolygon(bounds) } } })
    .sort({ name: 1 })
    .limit(bounds.limit)
    .toArray();
}

export function updateRestaurant(id: string, changes: Partial<RestaurantDoc>) {
  return restaurants.findOneAndUpdate(
    { _id: id },
    { $set: { ...changes, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function countRestaurants() {
  const [total, open] = await Promise.all([
    restaurants.countDocuments({ isActive: true }),
    restaurants.countDocuments({ isActive: true, queueState: "open" }),
  ]);
  return { total, open };
}
