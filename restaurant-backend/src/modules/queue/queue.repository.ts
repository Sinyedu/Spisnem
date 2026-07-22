import { pool } from "../../database/pool.js";
import type { Db, JoinQueueInput, QueueEntry, QueueStatus } from "../../types/index.js";

const entryColumns = `
  id,
  restaurant_id AS "restaurantId",
  guest_name AS "guestName",
  phone,
  party_size AS "partySize",
  notes,
  status,
  joined_at AS "joinedAt",
  notified_at AS "notifiedAt",
  seated_at AS "seatedAt",
  cancelled_at AS "cancelledAt"
`;

// Each status writes its own timestamp column; waiting and no_show have none.
const timestampColumnByStatus: Record<QueueStatus, string | null> = {
  waiting: null,
  notified: "notified_at",
  seated: "seated_at",
  cancelled: "cancelled_at",
  no_show: null,
};

export async function insertQueueEntry(
  restaurantId: string,
  input: JoinQueueInput,
  tokenHash: string,
) {
  const result = await pool.query<QueueEntry>(
    `INSERT INTO queue_entries (restaurant_id, guest_name, phone, party_size, notes, public_token_hash)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${entryColumns}`,
    [
      restaurantId,
      input.guestName,
      input.phone ?? null,
      input.partySize,
      input.notes ?? null,
      tokenHash,
    ],
  );
  return result.rows[0]!;
}

export async function findQueueEntryByTokenHash(tokenHash: string) {
  const result = await pool.query<QueueEntry>(
    `SELECT ${entryColumns} FROM queue_entries WHERE public_token_hash = $1`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function findQueueEntryByTokenHashForRestaurant(
  restaurantId: string,
  tokenHash: string,
  db: Db,
) {
  const result = await db.query<QueueEntry>(
    `SELECT ${entryColumns}
     FROM queue_entries
     WHERE restaurant_id = $1 AND public_token_hash = $2`,
    [restaurantId, tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function findQueueEntryById(restaurantId: string, id: string) {
  const result = await pool.query<QueueEntry>(
    `SELECT ${entryColumns} FROM queue_entries WHERE restaurant_id = $1 AND id = $2`,
    [restaurantId, id],
  );
  return result.rows[0] ?? null;
}

export async function listActiveQueue(restaurantId: string) {
  const result = await pool.query<QueueEntry>(
    `SELECT ${entryColumns}
     FROM queue_entries
     WHERE restaurant_id = $1 AND status IN ('waiting', 'notified')
     ORDER BY joined_at`,
    [restaurantId],
  );
  return result.rows;
}

// Position is how many active guests joined before this one, plus one.
export async function countAheadInQueue(restaurantId: string, joinedAt: string) {
  const result = await pool.query<{ count: string }>(
    `SELECT count(*)::text AS count
     FROM queue_entries
     WHERE restaurant_id = $1 AND status IN ('waiting', 'notified') AND joined_at < $2`,
    [restaurantId, joinedAt],
  );
  return Number(result.rows[0]?.count ?? 0);
}

export async function updateQueueEntryStatus(
  restaurantId: string,
  id: string,
  status: QueueStatus,
) {
  const timestampColumn = timestampColumnByStatus[status];
  const timestampSet = timestampColumn ? `, ${timestampColumn} = now()` : "";

  const result = await pool.query<QueueEntry>(
    `UPDATE queue_entries
     SET status = $3, updated_at = now()${timestampSet}
     WHERE restaurant_id = $1 AND id = $2
     RETURNING ${entryColumns}`,
    [restaurantId, id, status],
  );
  return result.rows[0] ?? null;
}
