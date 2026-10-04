import { createContext, useContext } from "react";
import type { QueueEntryState } from "../types/customer";

export const QueueEntryContext = createContext<QueueEntryState | null>(null);

/** The guest's live ticket. One stream is shared by every screen that shows it. */
export function useCurrentQueueEntry() {
  const state = useContext(QueueEntryContext);
  if (!state) throw new Error("useCurrentQueueEntry must be used inside QueueEntryProvider");
  return state;
}
