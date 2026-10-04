import type { QueueState, RestaurantProperties } from "./api";

// The fields a wait is shown from, on both map pins and the restaurant page.
export type WaitSource = Pick<RestaurantProperties, "queueState" | "estimatedWaitMinutes" | "partiesWaiting">;

// What a guest sees about the wait: not joinable (and why), or a number of minutes.
export type WaitEstimate =
  | { open: false; state: Exclude<QueueState, "open"> }
  | { open: true; minutes: number; partiesAhead: number };
