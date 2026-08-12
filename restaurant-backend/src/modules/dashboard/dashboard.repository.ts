import { pool } from "../../database/pool.js";
import type { DashboardSummary, DashboardSummaryRow } from "../../types/index.js";

export async function getDashboardSummary(restaurantId: string): Promise<DashboardSummary> {
  const result = await pool.query<DashboardSummaryRow>(
    `SELECT
       (SELECT count(*) FROM queue_entries
         WHERE restaurant_id = $1 AND status = 'waiting')::text AS "waiting",
       (SELECT count(*) FROM queue_entries
         WHERE restaurant_id = $1 AND status = 'notified')::text AS "notified",
       (SELECT count(*) FROM queue_entries
         WHERE restaurant_id = $1 AND status = 'seated' AND seated_at >= date_trunc('day', now()))::text AS "seatedToday"`,
    [restaurantId],
  );

  const row = result.rows[0]!;
  return {
    queue: {
      waiting: Number(row.waiting),
      notified: Number(row.notified),
      seatedToday: Number(row.seatedToday),
    },
  };
}
