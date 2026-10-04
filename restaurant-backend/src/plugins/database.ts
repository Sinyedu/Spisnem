import type { FastifyInstance } from "fastify";
import { ensureIndexes } from "../database/indexes.js";
import { mongoClient } from "../database/mongo.js";

// Repositories import the collections directly; this sets up indexes once at startup
// and closes the connection with the app.
export async function registerDatabase(app: FastifyInstance) {
  await ensureIndexes();
  app.addHook("onClose", async () => {
    await mongoClient.close();
  });
}
