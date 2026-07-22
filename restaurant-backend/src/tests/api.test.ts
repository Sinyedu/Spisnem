import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../app.js";
import { env } from "../config/env.js";
import { pool } from "../database/pool.js";

// These tests need a migrated and seeded database; they are skipped without one.
const databaseAvailable = await pool
  .query("SELECT 1 FROM restaurants WHERE slug = 'spisnem'")
  .then((result) => result.rowCount === 1)
  .catch(() => false);

describe("api", { skip: databaseAvailable ? false : "no seeded database" }, () => {
  let app: FastifyInstance;

  before(async () => {
    app = await buildApp();
  });

  after(async () => {
    await app.close();
  });

  test("staff can log in", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: env.SEED_ADMIN_EMAIL, password: env.SEED_ADMIN_PASSWORD },
    });

    assert.equal(response.statusCode, 200);
    const body = response.json();
    assert.ok(body.data.accessToken);
    assert.equal(body.data.user.role, "owner");
  });

  test("customer can join the queue", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/public/restaurants/spisnem/queue",
      payload: { guestName: "Julia", partySize: 3 },
    });

    assert.equal(response.statusCode, 201);
    const body = response.json();
    assert.ok(body.data.token);
    assert.equal(body.data.status, "waiting");
    assert.ok(body.data.position >= 1);
  });
});

if (!databaseAvailable) {
  await pool.end();
}
