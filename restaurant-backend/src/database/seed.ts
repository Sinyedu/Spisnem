import { env } from "../config/env.js";
import { ensureIndexes } from "./indexes.js";
import { mongoClient } from "./mongo.js";
import { seedSpisnem } from "./seed-data.js";

try {
  await ensureIndexes();
  await seedSpisnem();
  console.log(`seeded restaurant spisnem and admin ${env.SEED_ADMIN_EMAIL}`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoClient.close();
}
