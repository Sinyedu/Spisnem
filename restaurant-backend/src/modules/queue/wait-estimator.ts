import type { LineEstimate, SnapshotParty, WaitSnapshot } from "../../types/estimate.js";
import type { EstimateBasis } from "../../types/queue.js";
import { MINUTE_MS } from "../../shared/time.js";

/*
 * How long until each guest is called. Pure functions over a snapshot, so the rules
 * are easy to test and the same numbers reach the guest app, the map and the dashboard.
 *
 * 1. Tables: if the restaurant has tables set up, simulate who gets which table next.
 * 2. Recent pace: otherwise, minutes per party from how many were seated lately,
 *    blended with the restaurant's own number while there is little history.
 * A wait the host typed in by hand always wins.
 */

// Look this far back when measuring how fast parties are being seated.
export const PACE_WINDOW_MINUTES = 60;
// After this many seatings in the window, trust the measured pace completely.
const FULL_CONFIDENCE_SEATINGS = 6;
const MIN_MINUTES_PER_PARTY = 1;
const MAX_MINUTES_PER_PARTY = 60;
// A called party is already walking in, so it holds the line up for half as long.
const CALLED_PARTY_WEIGHT = 0.5;
// A table marked "leaving soon" is expected to free up in this many minutes.
export const SOON_TABLE_MINUTES = 5;
// How long a table stays occupied before the restaurant has history of its own.
export const DEFAULT_TABLE_TURN_MINUTES = 45;
// Clearing and resetting a table between parties.
const TABLE_TURNOVER_MINUTES = 2;


function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function minutesPerParty(snapshot: WaitSnapshot): { minutes: number; basis: EstimateBasis } {
  const fallback = snapshot.fallbackMinutesPerParty;
  if (snapshot.seatedInWindow === 0) return { minutes: fallback, basis: "restaurant_default" };

  const observed = PACE_WINDOW_MINUTES / snapshot.seatedInWindow;
  const weight = Math.min(1, snapshot.seatedInWindow / FULL_CONFIDENCE_SEATINGS);
  const blended = weight * observed + (1 - weight) * fallback;
  return { minutes: clamp(blended, MIN_MINUTES_PER_PARTY, MAX_MINUTES_PER_PARTY), basis: "recent_pace" };
}

function paceEstimates(snapshot: WaitSnapshot, perParty: number) {
  let ahead = 0;
  return snapshot.queue.map((party) => {
    const minutes = Math.round(ahead * perParty);
    ahead += party.status === "notified" ? CALLED_PARTY_WEIGHT : 1;
    return minutes;
  });
}

type TableSlot = { seats: number; freeInMinutes: number };

function minutesUntilFree(table: WaitSnapshot["tables"][number], turn: number, now: Date) {
  if (table.status === "free") return 0;
  if (table.status === "soon") return SOON_TABLE_MINUTES;
  const sittingFor = table.seatedAt ? (now.getTime() - table.seatedAt.getTime()) / MINUTE_MS : 0;
  // A table that overran its usual time is assumed to be just about done.
  return Math.max(SOON_TABLE_MINUTES, turn - sittingFor);
}

function tableSlots(snapshot: WaitSnapshot, turn: number): TableSlot[] {
  return snapshot.tables
    .filter((table) => table.status !== "blocked")
    .map((table) => ({ seats: table.seats, freeInMinutes: minutesUntilFree(table, turn, snapshot.now) }));
}

// The table that frees up first among those big enough; the smaller one on a tie.
function bestSlot(slots: TableSlot[], party: SnapshotParty) {
  return slots
    .filter((slot) => slot.seats >= party.partySize)
    .sort((a, b) => a.freeInMinutes - b.freeInMinutes || a.seats - b.seats)[0];
}

function tableEstimates(snapshot: WaitSnapshot): (number | null)[] {
  const turn = snapshot.tableTurnMinutes ?? DEFAULT_TABLE_TURN_MINUTES;
  const slots = tableSlots(snapshot, turn);
  return snapshot.queue.map((party) => {
    const slot = bestSlot(slots, party);
    if (!slot) return null; // no table is big enough; fall back to pace
    const minutes = Math.round(slot.freeInMinutes);
    slot.freeInMinutes += turn + TABLE_TURNOVER_MINUTES;
    return minutes;
  });
}

function hasUsableTables(snapshot: WaitSnapshot) {
  return snapshot.tables.some((table) => table.status !== "blocked");
}

export function estimateLine(snapshot: WaitSnapshot): LineEstimate {
  const pace = minutesPerParty(snapshot);
  const byPace = paceEstimates(snapshot, pace.minutes);
  const byTables = hasUsableTables(snapshot) ? tableEstimates(snapshot) : null;
  const minutes = snapshot.queue.map(
    (party, index) => party.quoteOverrideMinutes ?? byTables?.[index] ?? byPace[index] ?? 0,
  );
  return { minutes, basis: byTables ? "tables" : pace.basis };
}

// The wait a new party of this size would be quoted if they joined right now.
export function estimateNewParty(snapshot: WaitSnapshot, partySize: number) {
  const newcomer: SnapshotParty = { id: "new", partySize, status: "waiting", quoteOverrideMinutes: null };
  const line = estimateLine({ ...snapshot, queue: [...snapshot.queue, newcomer] });
  return {
    minutes: line.minutes[line.minutes.length - 1] ?? 0,
    partiesAhead: snapshot.queue.length,
    basis: line.basis,
  };
}
