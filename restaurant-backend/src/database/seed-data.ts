import bcrypt from "bcrypt";
import { env } from "../config/env.js";
import { newId } from "../shared/ids.js";
import type { RestaurantDoc } from "../types/index.js";
import { menuCategories, menuItems, restaurants, staffUsers } from "./collections.js";
import { DEMO_RESTAURANTS, SPISNEM_CATEGORIES, SPISNEM_ITEMS } from "./seed-content.js";

const BCRYPT_ROUNDS = 10;

// Defaults every restaurant document starts with; the seed fills in the rest.
function restaurantDefaults(): Omit<RestaurantDoc, "_id" | "name" | "slug" | "createdAt" | "updatedAt"> {
  return {
    description: null, phone: null, address: null, city: "København", postalCode: null, countryCode: "DK",
    heroImageUrl: null, cuisine: null, priceLevel: null, location: null, queueState: "open",
    averageWaitMinutes: 10, graceMinutes: 5, maxPartySize: 20, currency: "DKK", isActive: true,
  };
}

// Creates the restaurant the first time, updates the seeded fields after that.
// MongoDB refuses a field in both $set and $setOnInsert, so defaults skip what the seed sets.
async function upsertRestaurant(slug: string, fields: Partial<RestaurantDoc> & { name: string }) {
  const now = new Date();
  const defaults = Object.fromEntries(Object.entries(restaurantDefaults()).filter(([key]) => !(key in fields)));
  const result = await restaurants.findOneAndUpdate(
    { slug },
    {
      $set: { ...fields, updatedAt: now },
      $setOnInsert: { ...defaults, _id: newId(), slug, createdAt: now },
    },
    { upsert: true, returnDocument: "after" },
  );
  return result!;
}

async function upsertAdmin(restaurantId: string) {
  const now = new Date();
  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, BCRYPT_ROUNDS);
  await staffUsers.updateOne(
    { emailLower: env.SEED_ADMIN_EMAIL.toLowerCase() },
    {
      $set: { passwordHash, memberships: [{ restaurantId, role: "owner" }], updatedAt: now },
      $setOnInsert: { _id: newId(), email: env.SEED_ADMIN_EMAIL, displayName: "Spisnem Admin", createdAt: now },
    },
    { upsert: true },
  );
}

async function seedMenu(restaurantId: string) {
  const now = new Date();
  const categoryIds = new Map<string, string>();
  for (const category of SPISNEM_CATEGORIES) {
    const existing = await menuCategories.findOne({ restaurantId, name: category.name });
    const id = existing?._id ?? newId();
    if (!existing) {
      await menuCategories.insertOne({ _id: id, restaurantId, name: category.name, description: null,
        sortOrder: category.sortOrder, isActive: true, createdAt: now, updatedAt: now });
    }
    categoryIds.set(category.name, id);
  }
  for (const [index, item] of SPISNEM_ITEMS.entries()) {
    if (await menuItems.findOne({ restaurantId, name: item.name })) continue;
    await menuItems.insertOne({ _id: newId(), restaurantId, categoryId: categoryIds.get(item.category) ?? null,
      name: item.name, description: item.description, priceMinor: item.priceMinor, currency: "DKK", imageUrl: null,
      isAvailable: true, isFeatured: item.featured, sortOrder: index, createdAt: now, updatedAt: now });
  }
}

/** The "spisnem" restaurant, its owner login and a small menu. Safe to run again. */
export async function seedSpisnem() {
  const restaurant = await upsertRestaurant("spisnem", {
    name: "Spisnem", description: "Fresh food without the waiting line", phone: "+4512345678",
    address: "Nørrebrogade 1", city: "København", postalCode: "2200", queueState: "open", averageWaitMinutes: 8,
  });
  await upsertAdmin(restaurant._id);
  await seedMenu(restaurant._id);
  return restaurant;
}

/** Invented venues for the map. Safe to run again. */
export async function seedDemoRestaurants() {
  for (const demo of DEMO_RESTAURANTS) {
    const { latitude, longitude, slug, ...fields } = demo;
    await upsertRestaurant(slug, {
      ...fields, isActive: true, location: { type: "Point", coordinates: [longitude, latitude] },
    });
  }
  return DEMO_RESTAURANTS.length;
}
