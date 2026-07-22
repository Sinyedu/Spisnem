export type DashboardSummary = {
  queue: {
    waiting: number;
    notified: number;
    seatedToday: number;
  };
  orders: {
    submitted: number;
    preparing: number;
    ready: number;
    completedToday: number;
    salesTodayMinor: number;
  };
};

// Postgres returns counts and sums as strings, so they are converted in the repository.
export type DashboardSummaryRow = Record<
  | "waiting"
  | "notified"
  | "seatedToday"
  | "submitted"
  | "preparing"
  | "ready"
  | "completedToday"
  | "salesTodayMinor",
  string
>;
