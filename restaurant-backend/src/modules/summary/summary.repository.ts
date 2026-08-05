import { pool } from "../../database/pool.js";
import type { PublicSummary } from "../../types/index.js";

// "openNow" uses queue_enabled as a proxy for "open" until real opening hours exist.
export async function getSummaryCounts(): Promise<PublicSummary> {
  const result = await pool.query<PublicSummary>(
    `SELECT
       count(*) FILTER (WHERE is_active)::int AS restaurants,
       count(*) FILTER (WHERE is_active AND queue_enabled)::int AS "openNow"
     FROM restaurants`,
  );
  return result.rows[0]!;
}
