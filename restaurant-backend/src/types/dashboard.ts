import type { QueueState } from "./queue.js";

export type DashboardSummary = {
  queue: {
    waiting: number;
    notified: number;
    seatedToday: number;
    state: QueueState;
    // Mean wait currently promised to the people in line (null when empty).
    averageQuoteMinutes: number | null;
  };
  tables: {
    free: number;
    seated: number;
    soon: number;
    blocked: number;
  };
};
