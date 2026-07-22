import { pool } from "../../database/pool.js";
import type { StaffUser } from "../../types/index.js";

export async function findStaffUserByEmail(email: string) {
  const result = await pool.query<StaffUser>(
    `SELECT u.id,
            u.email,
            u.password_hash AS "passwordHash",
            u.display_name AS "displayName",
            ru.restaurant_id AS "restaurantId",
            ru.role,
            r.name AS "restaurantName"
     FROM users u
     LEFT JOIN restaurant_users ru ON ru.user_id = u.id
     LEFT JOIN restaurants r ON r.id = ru.restaurant_id
     WHERE lower(u.email) = lower($1)
     LIMIT 1`,
    [email],
  );
  return result.rows[0] ?? null;
}
