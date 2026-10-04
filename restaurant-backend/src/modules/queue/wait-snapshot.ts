import type { QueueEntryDoc, RestaurantDoc, TableDoc, WaitSnapshot } from "../../types/index.js";
import { addMinutes } from "../../shared/time.js";
import { listTablesFor } from "../tables/tables.repository.js";
import { averageTableTurns, countSeatingsSince } from "./queue-events.repository.js";
import { listActiveEntries } from "./queue.repository.js";
import { PACE_WINDOW_MINUTES } from "./wait-estimator.js";

// Map pins and restaurant pages quote the wait for a typical party of two.
export const DEFAULT_QUOTE_PARTY_SIZE = 2;
// Learn table times from the last two weeks…
const TURN_HISTORY_DAYS = 14;
const MINUTES_PER_DAY = 24 * 60;
// …but only once there are enough of them to mean something.
const MIN_TURN_SAMPLES = 3;

function groupBy<T>(items: T[], key: (item: T) => string) {
  const groups = new Map<string, T[]>();
  for (const item of items) groups.set(key(item), [...(groups.get(key(item)) ?? []), item]);
  return groups;
}

type SnapshotSources = {
  entries: Map<string, QueueEntryDoc[]>;
  tables: Map<string, TableDoc[]>;
  seatings: Map<string, number>;
  turns: Map<string, { minutes: number; samples: number }>;
};

function buildSnapshot(restaurant: RestaurantDoc, sources: SnapshotSources, now: Date): WaitSnapshot {
  const turn = sources.turns.get(restaurant._id);
  return {
    now,
    queueState: restaurant.queueState,
    fallbackMinutesPerParty: restaurant.averageWaitMinutes,
    queue: (sources.entries.get(restaurant._id) ?? []).map((entry) => ({
      id: entry._id,
      partySize: entry.partySize,
      status: entry.status,
      quoteOverrideMinutes: entry.quoteOverrideMinutes,
    })),
    seatedInWindow: sources.seatings.get(restaurant._id) ?? 0,
    tables: (sources.tables.get(restaurant._id) ?? []).map(({ seats, status, seatedAt }) => ({ seats, status, seatedAt })),
    tableTurnMinutes: turn && turn.samples >= MIN_TURN_SAMPLES ? turn.minutes : null,
  };
}

/** Loads everything the estimate needs for several restaurants in four queries. */
export async function loadSnapshots(restaurantDocs: RestaurantDoc[], now = new Date()) {
  const ids = restaurantDocs.map((restaurant) => restaurant._id);
  if (ids.length === 0) return new Map<string, WaitSnapshot>();
  const [entries, tables, seatings, turns] = await Promise.all([
    listActiveEntries(ids),
    listTablesFor(ids),
    countSeatingsSince(ids, addMinutes(now, -PACE_WINDOW_MINUTES)),
    averageTableTurns(ids, addMinutes(now, -TURN_HISTORY_DAYS * MINUTES_PER_DAY)),
  ]);
  const sources: SnapshotSources = {
    entries: groupBy(entries, (entry) => entry.restaurantId),
    tables: groupBy(tables, (table) => table.restaurantId),
    seatings,
    turns,
  };
  return new Map(restaurantDocs.map((restaurant) => [restaurant._id, buildSnapshot(restaurant, sources, now)]));
}
