import pg from "pg";
import { env } from "../config/env";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});
