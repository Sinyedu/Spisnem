import { useQueueEntry } from "../hooks/useQueueEntry";
import type { ProviderProps } from "../types/customer";
import { QueueEntryContext } from "./queueEntryContext";

function QueueEntryProvider({ children }: ProviderProps) {
  const state = useQueueEntry();
  return <QueueEntryContext.Provider value={state}>{children}</QueueEntryContext.Provider>;
}

export default QueueEntryProvider;
