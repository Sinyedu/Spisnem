// Mirrors the public shapes returned by restaurant-backend (src/types/*).

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
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
};

export type RestaurantDetail = Restaurant & {
  queueLength: number;
  estimatedWaitMinutes: number;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
};

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

export type MenuCategoryWithItems = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
};

export type Menu = {
  categories: MenuCategoryWithItems[];
  uncategorized: MenuItem[];
  featured: MenuItem[];
};

export type QueueStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show";

export type PublicQueueEntry = {
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
  restaurant: RestaurantSummary;
};

// joinQueue returns the entry plus the one-time plain token.
export type JoinQueueResponse = PublicQueueEntry & { token: string };

export type JoinQueueInput = {
  guestName: string;
  partySize: number;
  phone?: string;
  notes?: string;
};
