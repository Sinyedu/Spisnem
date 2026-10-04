import { badRequest } from "../../shared/errors.js";
import type { InsightsRange } from "../../types/index.js";
import { RESTAURANT_TIME_ZONE } from "./insights.calculator.js";

// Longest range one request may ask for, so a query never scans years of visits.
const MAX_RANGE_DAYS = 31;
const DAY_MS = 24 * 60 * 60 * 1_000;

const dateParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: RESTAURANT_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

// How far the restaurant's clock is ahead of UTC at `date`, in ms (handles summer time).
function timeZoneOffset(date: Date) {
  const parts = Object.fromEntries(dateParts.formatToParts(date).map((part) => [part.type, part.value]));
  const asUtc = Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second));
  return asUtc - Math.floor(date.getTime() / 1_000) * 1_000;
}

// Midnight in the restaurant's time zone on the day of `date`.
export function startOfRestaurantDay(date: Date) {
  const offset = timeZoneOffset(date);
  const local = new Date(date.getTime() + offset);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() - offset);
}

/** Defaults to "today so far"; refuses ranges that are backwards or too long. */
export function resolveRange(from: Date | undefined, to: Date | undefined, now = new Date()): InsightsRange {
  const range = { from: from ?? startOfRestaurantDay(now), to: to ?? now };
  if (range.from >= range.to) throw badRequest("from must be before to", "INVALID_RANGE");
  if (range.to.getTime() - range.from.getTime() > MAX_RANGE_DAYS * DAY_MS) {
    throw badRequest(`Ranges are limited to ${MAX_RANGE_DAYS} days`, "RANGE_TOO_LONG");
  }
  return range;
}
