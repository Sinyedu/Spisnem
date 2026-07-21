import type { TransitionMap } from "../types/index.js";
import { conflict } from "./errors.js";

export function canTransition<T extends string>(map: TransitionMap<T>, from: T, to: T) {
  return map[from].includes(to);
}

export function assertTransition<T extends string>(
  map: TransitionMap<T>,
  from: T,
  to: T,
  subject: string,
) {
  if (!canTransition(map, from, to)) {
    throw conflict(
      `Cannot change ${subject} status from ${from} to ${to}`,
      "INVALID_STATUS_CHANGE",
    );
  }
}
