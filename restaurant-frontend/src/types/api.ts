// Single source for backend API response shapes.
// Mirrors restaurant-backend/src/types — keep in sync as endpoints are consumed.

export type Summary = {
  restaurants: number;
  openNow: number;
};

export type MapRestaurant = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  priceLevel: number | null;
  coverImageUrl: string | null;
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
    properties: MapRestaurant;
  }[];
};
