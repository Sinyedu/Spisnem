import type { useQueuePage } from "./useQueuePage";

// Everything the queue page's views read from useQueuePage.
export type QueuePageState = ReturnType<typeof useQueuePage>;

export type QueueViewProps = {
  queue: QueuePageState;
};
