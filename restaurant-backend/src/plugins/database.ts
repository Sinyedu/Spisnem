import type { FastifyInstance } from "fastify";
import { pool } from "../database/pool.js";

// Repositories import the pool directly; this only ties the pool to the app lifecycle.
export async function registerDatabase(app: FastifyInstance) {
  app.addHook("onClose", async () => {
    await pool.end();
  });
}
