import { minutesBetween } from "../../shared/time.js";
import type { HourBucket, Insights, InsightsRange, QueueEntryDoc, QuoteAccuracy } from "../../types/index.js";

// Restaurants are in Denmark for now; hours are shown in their local time.
export const RESTAURANT_TIME_ZONE = "Europe/Copenhagen";
// A quote counts as "accurate" when the guest was called within this many minutes of it.
const ACCURACY_TOLERANCE_MINUTES = 5;
const HOURS_IN_DAY = 24;

const hourFormat = new Intl.DateTimeFormat("en-GB", { hour: "numeric", hourCycle: "h23", timeZone: RESTAURANT_TIME_ZONE });

// Minutes from joining until the guest was called (or seated, if never called first).
export function actualWaitMinutes(entry: Pick<QueueEntryDoc, "joinedAt" | "notifiedAt" | "seatedAt">) {
  const reached = entry.notifiedAt ?? entry.seatedAt;
  return reached ? minutesBetween(entry.joinedAt, reached) : null;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function waits(entries: QueueEntryDoc[]) {
  return entries.map(actualWaitMinutes).filter((minutes): minutes is number => minutes !== null);
}

function byHour(entries: QueueEntryDoc[]): HourBucket[] {
  const buckets = Array.from({ length: HOURS_IN_DAY }, () => [] as QueueEntryDoc[]);
  for (const entry of entries) buckets[Number(hourFormat.format(entry.joinedAt))]?.push(entry);
  return buckets
    .map((bucket, hour) => ({ hour, parties: bucket.length, averageWaitMinutes: average(waits(bucket)) }))
    .filter((bucket) => bucket.parties > 0);
}

export function quoteAccuracy(entries: QueueEntryDoc[]): QuoteAccuracy {
  const errors = entries.flatMap((entry) => {
    const actual = actualWaitMinutes(entry);
    return actual === null || entry.quotedWaitMinutes === null ? [] : [Math.abs(actual - entry.quotedWaitMinutes)];
  });
  if (errors.length === 0) return { samples: 0, meanAbsoluteErrorMinutes: null, withinFiveMinutesShare: null };
  const within = errors.filter((error) => error <= ACCURACY_TOLERANCE_MINUTES).length;
  return { samples: errors.length, meanAbsoluteErrorMinutes: average(errors), withinFiveMinutesShare: within / errors.length };
}

/** Everything the Insights page shows, from the entries that joined within the range. */
export function summarizeInsights(entries: QueueEntryDoc[], range: InsightsRange): Insights {
  const seated = entries.filter((entry) => entry.status === "seated");
  return {
    from: range.from.toISOString(),
    to: range.to.toISOString(),
    parties: entries.length,
    guestsSeated: seated.reduce((sum, entry) => sum + entry.partySize, 0),
    seated: seated.length,
    leftQueue: entries.filter((entry) => entry.status === "cancelled").length,
    noShows: entries.filter((entry) => entry.status === "no_show").length,
    averageWaitMinutes: average(waits(entries)),
    byHour: byHour(entries),
    accuracy: quoteAccuracy(entries),
  };
}
