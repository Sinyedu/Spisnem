import type { FastifyInstance } from "fastify";
import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Starts a throwaway MongoDB, points the app at it and seeds it. Modules that read the
 * environment are imported only after MONGODB_URI is set, hence the dynamic imports.
 */
export async function startTestApp() {
  const mongo = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongo.getUri();
  process.env.MONGODB_DB_NAME = "spisnem-test";
  process.env.NODE_ENV = "test";

  const { buildApp } = await import("../app.js");
  const { seedDemoRestaurants, seedSpisnem } = await import("../database/seed-data.js");
  const { env } = await import("../config/env.js");
  const app = await buildApp();
  const stop = async () => {
    await app.close();
    await mongo.stop();
  };
  try {
    await seedSpisnem();
    await seedDemoRestaurants();
  } catch (error) {
    // Stop the throwaway database too, or the test process never exits.
    await stop();
    throw error;
  }
  return { app, env, stop };
}

export async function staffToken(app: FastifyInstance, email: string, password: string) {
  const login = await app.inject({ method: "POST", url: "/api/auth/login", payload: { email, password } });
  return login.json().data.accessToken as string;
}

export function bearer(token: string) {
  return { authorization: `Bearer ${token}` };
}

export async function joinQueue(app: FastifyInstance, guestName: string, partySize = 2) {
  const response = await app.inject({
    method: "POST",
    url: "/api/public/restaurants/spisnem/queue",
    payload: { guestName, partySize },
  });
  return response.json().data as { id: string; token: string; position: number; quotedWaitMinutes: number };
}
