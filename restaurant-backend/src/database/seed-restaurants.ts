import { ensureIndexes } from "./indexes.js";
import { mongoClient } from "./mongo.js";
import { seedDemoRestaurants } from "./seed-data.js";

try {
  await ensureIndexes();
  const count = await seedDemoRestaurants();
  console.log(`seeded ${count} demo restaurants`);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await mongoClient.close();
}
