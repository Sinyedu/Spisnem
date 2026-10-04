export const MINUTE_MS = 60_000;

export function minutesBetween(from: Date, to: Date) {
  return Math.max(0, Math.round((to.getTime() - from.getTime()) / MINUTE_MS));
}

export function addMinutes(date: Date, minutes: number) {
  return new Date(date.getTime() + minutes * MINUTE_MS);
}

export function isoOrNull(date: Date | null) {
  return date ? date.toISOString() : null;
}
