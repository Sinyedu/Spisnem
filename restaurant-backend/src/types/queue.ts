import type { RestaurantSummary } from "./restaurant.js";

export type QueueStatus = "waiting" | "notified" | "seated" | "cancelled" | "no_show";

// Whether new guests can join: open, paused for a moment, or closed for the day.
export type QueueState = "open" | "paused" | "closed";

export type QueueSource = "app" | "walk_in";

// Every line in the queue diary. "table_freed" is what teaches the estimate real table times.
export type QueueEventType =
  | "joined"
  | "called"
  | "on_my_way"
  | "late"
  | "extended"
  | "reordered"
  | "quote_changed"
  | "seated"
  | "cancelled"
  | "no_show"
  | "table_freed";

export type QueueEntry = {
  id: string;
  restaurantId: string;
  guestName: string;
  phone: string | null;
  partySize: number;
  notes: string | null;
  status: QueueStatus;
  source: QueueSource;
  quotedWaitMinutes: number | null;
  quoteOverrideMinutes: number | null;
  tableId: string | null;
  lateCount: number;
  joinedAt: string;
  notifiedAt: string | null;
  onMyWayAt: string | null;
  graceUntil: string | null;
  seatedAt: string | null;
  cancelledAt: string | null;
  noShowAt: string | null;
};

export type QueuePlace = {
  position: number | null;
  estimatedWaitMinutes: number | null;
};

export type PublicQueueEntry = QueueEntry &
  QueuePlace & {
    restaurant: RestaurantSummary;
    // Guests may push themselves back once with "running late".
    canReportLate: boolean;
  };

// What the dashboard list shows per guest.
export type StaffQueueEntry = QueueEntry &
  QueuePlace & {
    waitedMinutes: number;
  };

export type JoinQueueInput = {
  guestName: string;
  phone?: string | undefined;
  partySize: number;
  notes?: string | undefined;
};

export type WalkInInput = {
  guestName?: string | undefined;
  phone?: string | undefined;
  partySize: number;
  notes?: string | undefined;
  quotedWaitMinutes?: number | undefined;
};

export type EditEntryInput = {
  guestName?: string | undefined;
  partySize?: number | undefined;
  notes?: string | null | undefined;
  // 1-based place in line to move the guest to.
  position?: number | undefined;
  // A hand-typed wait; null clears it and goes back to the estimate.
  quotedWaitMinutes?: number | null | undefined;
};

export type QueueSettingsInput = {
  queueState?: QueueState | undefined;
  averageWaitMinutes?: number | undefined;
  graceMinutes?: number | undefined;
  maxPartySize?: number | undefined;
};

export type WaitEstimate = {
  estimatedWaitMinutes: number;
  partiesAhead: number;
  queueState: QueueState;
  // Which model produced the number, so the dashboard can explain it.
  basis: EstimateBasis;
};

export type EstimateBasis = "tables" | "recent_pace" | "restaurant_default";
