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
  heroImageUrl: string | null;
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

export type QueueStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show";

export type QueueRestaurant = {
  id: string;
  name: string;
  slug: string;
};

export type QueueEntry = {
  id: string;
  restaurantId: string;
  guestName: string;
  phone: string | null;
  partySize: number;
  notes: string | null;
  status: QueueStatus;
  joinedAt: string;
  notifiedAt: string | null;
  seatedAt: string | null;
  cancelledAt: string | null;
  position: number | null;
  estimatedWaitMinutes: number | null;
  restaurant: QueueRestaurant;
};

export type QueueJoinInput = {
  guestName: string;
  phone?: string;
  partySize: number;
  notes?: string;
};

export type JoinedQueueEntry = QueueEntry & {
  token: string;
};
