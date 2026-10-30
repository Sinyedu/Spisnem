import {
  favourites,
  menuCategories,
  menuItems,
  queueEntries,
  queueEvents,
  restaurantTables,
  restaurants,
  staffUsers,
} from "./collections.js";

/**
 * Replaces the old SQL migrations. MongoDB has no fixed schema, so the only thing
 * to set up is indexes; creating one that already exists is a no-op.
 */
export async function ensureIndexes() {
  await Promise.all([
    restaurants.createIndex({ slug: 1 }, { unique: true }),
    restaurants.createIndex({ location: "2dsphere" }),
    restaurants.createIndex({ isActive: 1, name: 1 }),
    staffUsers.createIndex({ emailLower: 1 }, { unique: true }),
    queueEntries.createIndex({ tokenHash: 1 }, { unique: true }),
    queueEntries.createIndex({ restaurantId: 1, status: 1, sortKey: 1 }),
    queueEntries.createIndex({ restaurantId: 1, joinedAt: -1 }),
    queueEntries.createIndex({ customerUserId: 1, joinedAt: -1 }),
    queueEvents.createIndex({ restaurantId: 1, type: 1, at: -1 }),
    queueEvents.createIndex({ entryId: 1, at: 1 }),
    restaurantTables.createIndex({ restaurantId: 1, label: 1 }, { unique: true }),
    menuCategories.createIndex({ restaurantId: 1, sortOrder: 1 }),
    menuItems.createIndex({ restaurantId: 1, sortOrder: 1 }),
    menuItems.createIndex({ categoryId: 1 }),
    favourites.createIndex({ customerUserId: 1, restaurantId: 1 }, { unique: true }),
  ]);
}
