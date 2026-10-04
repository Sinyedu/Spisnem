import type { QueueStatus } from "./queue.js";
import type { RestaurantSummary } from "./restaurant.js";

// One past or current visit in a signed-in guest's history.
export type CustomerVisit = {
  id: string;
  status: QueueStatus;
  partySize: number;
  joinedAt: string;
  quotedWaitMinutes: number | null;
  // Minutes from joining to being called (or seated), once that has happened.
  actualWaitMinutes: number | null;
  restaurant: RestaurantSummary;
};

export type FavouriteRestaurant = RestaurantSummary & {
  cuisine: string | null;
  heroImageUrl: string | null;
  addedAt: string;
};
