import type { RestaurantSummary } from "./restaurant.js";

export type QueueStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show";

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
};

export type QueuePlace = {
  position: number | null;
  estimatedWaitMinutes: number | null;
};

export type PublicQueueEntry = QueueEntry & QueuePlace & { restaurant: RestaurantSummary };

export type JoinQueueInput = {
  guestName: string;
  phone?: string | undefined;
  partySize: number;
  notes?: string | undefined;
};
