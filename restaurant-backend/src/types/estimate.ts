import type { EstimateBasis, QueueState, QueueStatus } from "./queue.js";
import type { TableStatus } from "./tables.js";

export type SnapshotParty = {
  id: string;
  partySize: number;
  status: QueueStatus;
  quoteOverrideMinutes: number | null;
};

export type SnapshotTable = {
  seats: number;
  status: TableStatus;
  seatedAt: Date | null;
};

// Everything the estimate needs about one restaurant at one moment.
export type WaitSnapshot = {
  now: Date;
  queueState: QueueState;
  // The restaurant's own "minutes per party", used until it has history.
  fallbackMinutesPerParty: number;
  // Active guests (waiting or called), in line order.
  queue: SnapshotParty[];
  // Parties seated during the pace window (see PACE_WINDOW_MINUTES).
  seatedInWindow: number;
  tables: SnapshotTable[];
  // Average minutes a table stays occupied, learned from history; null until known.
  tableTurnMinutes: number | null;
};

export type LineEstimate = {
  // Minutes until each party in the snapshot is called, same order as the queue.
  minutes: number[];
  basis: EstimateBasis;
};
