// Single source for backend API response shapes.
// Mirrors restaurant-backend/src/types — keep in sync as endpoints are consumed.

export type Summary = {
  restaurants: number;
  openNow: number;
};

// open: joinable. paused: briefly not taking app guests. closed: done for the day.
export type QueueState = "open" | "paused" | "closed";

// What the map endpoint puts in each feature's properties.
export type RestaurantProperties = {
  id: string;
  name: string;
  slug: string;
  cuisine: string | null;
  priceLevel: number | null;
  heroImageUrl: string | null;
  // true exactly when queueState is "open".
  queueEnabled: boolean;
  queueState: QueueState;
  averageWaitMinutes: number;
  // Parties in line right now (waiting or already called).
  partiesWaiting: number;
  // What a party of two would be quoted if they joined now (server estimate).
  estimatedWaitMinutes: number;
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
  graceMinutes: number;
  maxPartySize: number;
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
  source: "app" | "walk_in";
  quotedWaitMinutes: number | null;
  joinedAt: string;
  notifiedAt: string | null;
  onMyWayAt: string | null;
  // When a called guest's time to walk in runs out.
  graceUntil: string | null;
  seatedAt: string | null;
  cancelledAt: string | null;
  position: number | null;
  estimatedWaitMinutes: number | null;
  canReportLate: boolean;
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

// GET /public/restaurants/:slug/queue/estimate
export type WaitEstimate = {
  estimatedWaitMinutes: number;
  partiesAhead: number;
  queueState: QueueState;
  basis: "tables" | "recent_pace" | "restaurant_default";
};

// "Running late" offers these choices only.
export type LateMinutes = 5 | 10 | 15;

export type MenuItem = {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type MenuCategory = {
  id: string;
  name: string;
  description: string | null;
  items: MenuItem[];
};

// GET /public/restaurants/:slug/menu
export type Menu = {
  categories: MenuCategory[];
  uncategorized: MenuItem[];
  featured: MenuItem[];
};

export type FavouriteRestaurant = QueueRestaurant & {
  cuisine: string | null;
  heroImageUrl: string | null;
  addedAt: string;
};

export type CustomerVisit = {
  id: string;
  status: QueueStatus;
  partySize: number;
  joinedAt: string;
  quotedWaitMinutes: number | null;
  actualWaitMinutes: number | null;
  restaurant: QueueRestaurant;
};

// The signed-in guest, from Better Auth's get-session.
export type CustomerUser = {
  id: string;
  name: string;
  email: string;
};
