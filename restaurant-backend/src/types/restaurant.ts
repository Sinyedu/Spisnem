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
  queueEnabled: boolean;
  averageWaitMinutes: number;
  currency: string;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
};

export type MapRestaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  priceLevel: number | null;
  heroImageUrl: string | null;
  latitude: number;
  longitude: number;
};

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
  averageWaitMinutes: number;
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
