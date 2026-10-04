// How each collection's documents are stored. API shapes live in the other type files;
// mappers turn one into the other (Date → ISO string, location → latitude/longitude).
// Ids are UUID strings, the same ids the API has always used.

import type { StaffRole } from "./auth.js";
import type { QueueEventType, QueueSource, QueueState, QueueStatus } from "./queue.js";
import type { TableStatus } from "./tables.js";

export type GeoPoint = { type: "Point"; coordinates: [longitude: number, latitude: number] };

export type RestaurantDoc = {
  _id: string;
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
  location: GeoPoint | null;
  queueState: QueueState;
  // Minutes each party ahead adds before the restaurant has history of its own.
  averageWaitMinutes: number;
  graceMinutes: number;
  maxPartySize: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type StaffMembership = { restaurantId: string; role: StaffRole };

export type StaffUserDoc = {
  _id: string;
  email: string;
  // Lower-cased copy, so logins match whatever case people type.
  emailLower: string;
  passwordHash: string;
  displayName: string;
  memberships: StaffMembership[];
  createdAt: Date;
  updatedAt: Date;
};

export type QueueEntryDoc = {
  _id: string;
  restaurantId: string;
  guestName: string;
  phone: string | null;
  partySize: number;
  notes: string | null;
  status: QueueStatus;
  source: QueueSource;
  tokenHash: string;
  // Set when a signed-in guest joins, so the visit shows in their history.
  customerUserId: string | null;
  // Line order. Starts as the join time in ms; staff reordering moves it between neighbours.
  sortKey: number;
  // What the guest was promised at join, kept to measure how accurate quotes are.
  quotedWaitMinutes: number | null;
  // A wait the host typed in by hand; wins over the estimate while set.
  quoteOverrideMinutes: number | null;
  tableId: string | null;
  lateCount: number;
  joinedAt: Date;
  notifiedAt: Date | null;
  onMyWayAt: Date | null;
  graceUntil: Date | null;
  seatedAt: Date | null;
  cancelledAt: Date | null;
  noShowAt: Date | null;
  updatedAt: Date;
};

export type QueueEventDoc = {
  _id: string;
  restaurantId: string;
  entryId: string | null;
  tableId: string | null;
  type: QueueEventType;
  actor: "guest" | "staff" | "system";
  staffUserId: string | null;
  at: Date;
  data: Record<string, number | string | null>;
};

export type TableDoc = {
  _id: string;
  restaurantId: string;
  label: string;
  seats: number;
  status: TableStatus;
  seatedAt: Date | null;
  entryId: string | null;
  partySize: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuCategoryDoc = {
  _id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type MenuItemDoc = {
  _id: string;
  restaurantId: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FavouriteDoc = {
  _id: string;
  customerUserId: string;
  restaurantId: string;
  createdAt: Date;
};
