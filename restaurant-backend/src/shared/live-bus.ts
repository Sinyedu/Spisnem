import { EventEmitter } from "node:events";

/*
 * Tells open live streams (guest tickets, dashboard screens) that a restaurant's queue
 * or tables changed. In-process only: with several server instances this would move to
 * MongoDB change streams, which need a replica set.
 */

export type LiveChangeKind = "queue" | "tables" | "settings";

export type LiveChange = {
  kind: LiveChangeKind;
  // The queue entry or table that changed, when there is one.
  id: string | null;
};

const bus = new EventEmitter();
// Every open stream is one listener; there is no meaningful upper limit.
bus.setMaxListeners(0);

function channel(restaurantId: string) {
  return `restaurant:${restaurantId}`;
}

export function publishChange(restaurantId: string, change: LiveChange) {
  bus.emit(channel(restaurantId), change);
}

export function subscribeToChanges(restaurantId: string, listener: (change: LiveChange) => void) {
  bus.on(channel(restaurantId), listener);
  return () => {
    bus.off(channel(restaurantId), listener);
  };
}
