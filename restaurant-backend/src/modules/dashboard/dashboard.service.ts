import type { DashboardSummary, TableStatus } from "../../types/index.js";
import { startOfRestaurantDay } from "../insights/insights.range.js";
import { loadLine } from "../queue/queue-line.js";
import { countSeatedSince } from "../queue/queue.repository.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";
import { listTables } from "../tables/tables.repository.js";
import { notFound } from "../../shared/errors.js";

const TABLE_STATUSES: TableStatus[] = ["free", "seated", "soon", "blocked"];

function averageOf(values: number[]) {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

/** The numbers on the dashboard's front page: the line, today's seatings and the floor. */
export async function getDashboardSummary(restaurantId: string): Promise<DashboardSummary> {
  const restaurant = await findRestaurantById(restaurantId);
  if (!restaurant) throw notFound("Restaurant not found");
  const [line, tables, seatedToday] = await Promise.all([
    loadLine(restaurant),
    listTables(restaurantId),
    countSeatedSince(restaurantId, startOfRestaurantDay(new Date())),
  ]);
  const queue = line.snapshot.queue;
  const tableCounts = Object.fromEntries(
    TABLE_STATUSES.map((status) => [status, tables.filter((table) => table.status === status).length]),
  ) as Record<TableStatus, number>;
  return {
    queue: {
      waiting: queue.filter((party) => party.status === "waiting").length,
      notified: queue.filter((party) => party.status === "notified").length,
      seatedToday,
      state: restaurant.queueState,
      averageQuoteMinutes: averageOf(line.estimate.minutes),
    },
    tables: tableCounts,
  };
}
