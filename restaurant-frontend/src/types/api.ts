// Single source for backend API response shapes.
// Mirrors restaurant-backend/src/types — keep in sync as endpoints are consumed.

export type Summary = {
  restaurants: number;
  openNow: number;
};

// What the map endpoint puts in each feature's properties.
export type RestaurantProperties = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  priceLevel: number | null;
  coverImageUrl: string | null;
};

// A feature flattened for the UI, with the point coordinates folded in.
export type MapRestaurant = RestaurantProperties & {
  longitude: number;
  latitude: number;
};

// The fuller record from GET /public/restaurants/:slug.
export type Restaurant = RestaurantProperties & {
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  queueEnabled: boolean;
  averageWaitMinutes: number;
};

// Query accepted by GET /public/restaurants/map.
export type MapBounds = {
  west: number;
  south: number;
  east: number;
  north: number;
  limit: number;
};

export type RestaurantFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    id: string;
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: RestaurantProperties;
  }[];
};
