import type { GeoPoint, Restaurant, RestaurantDoc, RestaurantSummary } from "../../types/index.js";

export function toRestaurant(doc: RestaurantDoc): Restaurant {
  return {
    id: doc._id,
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    phone: doc.phone,
    address: doc.address,
    city: doc.city,
    postalCode: doc.postalCode,
    countryCode: doc.countryCode,
    heroImageUrl: doc.heroImageUrl,
    cuisine: doc.cuisine,
    priceLevel: doc.priceLevel,
    latitude: doc.location?.coordinates[1] ?? null,
    longitude: doc.location?.coordinates[0] ?? null,
    queueEnabled: doc.queueState === "open",
    queueState: doc.queueState,
    averageWaitMinutes: doc.averageWaitMinutes,
    graceMinutes: doc.graceMinutes,
    maxPartySize: doc.maxPartySize,
    currency: doc.currency,
  };
}

export function toRestaurantSummary(doc: Pick<RestaurantDoc, "_id" | "name" | "slug">): RestaurantSummary {
  return { id: doc._id, name: doc.name, slug: doc.slug };
}

export function toGeoPoint(latitude: number | null, longitude: number | null): GeoPoint | null {
  if (latitude === null || longitude === null) return null;
  return { type: "Point", coordinates: [longitude, latitude] };
}
