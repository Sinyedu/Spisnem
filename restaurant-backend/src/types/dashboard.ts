export type DashboardSummary = {
  queue: {
    waiting: number;
    notified: number;
    seatedToday: number;
  };
};

// Postgres returns counts as strings, so they are converted in the repository.
export type DashboardSummaryRow = Record<"waiting" | "notified" | "seatedToday", string>;
