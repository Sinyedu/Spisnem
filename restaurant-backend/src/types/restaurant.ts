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
  coverImageUrl: string | null;
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
