import type { QueueState } from "./queue.js";

export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  countryCode: string;
  heroImageUrl: string | null;
  cuisine: string | null;
  priceLevel: number | null;
  latitude: number | null;
  longitude: number | null;
  // Kept for existing clients: true exactly when queueState is "open".
  queueEnabled: boolean;
  queueState: QueueState;
  averageWaitMinutes: number;
  graceMinutes: number;
  maxPartySize: number;
  currency: string;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
};

// Live queue figures attached to a restaurant on the map and the public page.
export type RestaurantQueueInfo = {
  partiesWaiting: number;
  // The wait a party of two would be quoted if they joined right now.
  estimatedWaitMinutes: number;
};

export type MapRestaurant = RestaurantQueueInfo & {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  priceLevel: number | null;
  heroImageUrl: string | null;
  latitude: number;
  longitude: number;
  queueEnabled: boolean;
  queueState: QueueState;
  averageWaitMinutes: number;
};

export type PublicRestaurant = Restaurant & RestaurantQueueInfo;

export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
  limit: number;
};

type RestaurantProfileFields = {
  name: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  countryCode: string;
  heroImageUrl: string | null;
  cuisine: string | null;
  priceLevel: number | null;
  latitude: number | null;
  longitude: number | null;
  queueEnabled: boolean;
  queueState: QueueState;
  averageWaitMinutes: number;
  graceMinutes: number;
  maxPartySize: number;
};

export type UpdateRestaurantProfileInput = {
  [Key in keyof RestaurantProfileFields]?: RestaurantProfileFields[Key] | undefined;
};

export type RestaurantFeature = {
  type: "Feature";
  id: string;
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: Omit<MapRestaurant, "latitude" | "longitude">;
};

export type RestaurantFeatureCollection = {
  type: "FeatureCollection";
  features: RestaurantFeature[];
};
