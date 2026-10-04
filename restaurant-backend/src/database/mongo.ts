import { MongoClient } from "mongodb";
import { env } from "../config/env.js";

// Matches the dashboard backend's connection settings.
const MAX_POOL_SIZE = 10;
const SERVER_SELECTION_TIMEOUT_MS = 5_000;

// The driver connects on the first operation, so importing this never blocks startup.
export const mongoClient = new MongoClient(env.MONGODB_URI, {
  maxPoolSize: MAX_POOL_SIZE,
  serverSelectionTimeoutMS: SERVER_SELECTION_TIMEOUT_MS,
});

export const db = mongoClient.db(env.MONGODB_DB_NAME);
