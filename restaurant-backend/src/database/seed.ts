import bcrypt from "bcrypt";
import { pool } from "./pool.js";
import { env } from "../config/env.js";
import type { IdRow } from "../types/index.js";

/*
 * DEVELOPMENT SEED DATA — NOT REAL.
 *
 * This exists so the app has something to render locally (the map needs a few
 * restaurants with coordinates, the detail screen needs a menu). Ratings,
 * coordinates and image URLs are illustrative placeholders, not verified data —
 * replace them with real restaurant onboarding before any non-dev use.
 *
 * The flagship "spisnem" restaurant is owned by the seed admin so the staff
 * dashboard has a login.
 */

type SeedItem = {
  category: string;
  name: string;
  description: string;
  priceMinor: number;
  featured?: boolean;
  imageUrl?: string;
};

type SeedRestaurant = {
  slug: string;
  name: string;
  description: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  rating: number;
  averageWaitMinutes: number;
  heroImageUrl: string;
  categories: { name: string; sortOrder: number }[];
  items: SeedItem[];
};

// Placeholder Unsplash imagery, kept in one place so it is obviously demo data.
const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=80&auto=format&fit=crop`;

const restaurants: SeedRestaurant[] = [
  {
    slug: "spisnem",
    name: "Spisnem",
    description: "Fresh food without the waiting line",
    phone: "+4512345678",
    address: "Nørrebrogade 1",
    city: "København",
    postalCode: "2200",
    latitude: 55.6889,
    longitude: 12.553,
    rating: 4.6,
    averageWaitMinutes: 8,
    heroImageUrl: img("1517248135467-4c7edcad34c4"),
    categories: [
      { name: "Pizza", sortOrder: 1 },
      { name: "Mains", sortOrder: 2 },
      { name: "Drinks", sortOrder: 3 },
    ],
    items: [
      { category: "Pizza", name: "Margherita", description: "Tomato, mozzarella, basil", priceMinor: 8900, featured: true, imageUrl: img("1513104890138-7c749659a591") },
      { category: "Pizza", name: "Vegetariana", description: "Seasonal vegetables", priceMinor: 9500 },
      { category: "Mains", name: "Burger and fries", description: "Beef patty, cheddar, house sauce", priceMinor: 12900, imageUrl: img("1568901346375-23c9450c58cd") },
      { category: "Drinks", name: "House lemonade", description: "Lemon and mint", priceMinor: 3500 },
    ],
  },
  {
    slug: "mad-og-kaffe",
    name: "Mad & Kaffe",
    description: "Brunch & breakfast · Vesterbro, Copenhagen",
    phone: "+4531223344",
    address: "Sønder Boulevard 68",
    city: "København",
    postalCode: "1720",
    latitude: 55.6667,
    longitude: 12.551,
    rating: 4.3,
    averageWaitMinutes: 12,
    heroImageUrl: img("1552566626-52f8b828add9"),
    categories: [
      { name: "Brunch", sortOrder: 1 },
      { name: "Drinks", sortOrder: 2 },
    ],
    items: [
      { category: "Brunch", name: "Pick 3 brunch", description: "Choose three small brunch plates", priceMinor: 12500, featured: true, imageUrl: img("1533089860892-a7c6f0a88666") },
      { category: "Brunch", name: "Avocado toast", description: "Sourdough, avocado, chili, lime", priceMinor: 8900 },
      { category: "Drinks", name: "Flat white", description: "Double shot, oat or dairy", priceMinor: 4200 },
    ],
  },
  {
    slug: "host",
    name: "Höst",
    description: "New Nordic · Indre By, Copenhagen",
    phone: "+4589933321",
    address: "Nørre Farimagsgade 41",
    city: "København",
    postalCode: "1364",
    latitude: 55.6847,
    longitude: 12.568,
    rating: 4.7,
    averageWaitMinutes: 20,
    heroImageUrl: img("1414235077428-338989a2e8c0"),
    categories: [
      { name: "Starters", sortOrder: 1 },
      { name: "Mains", sortOrder: 2 },
    ],
    items: [
      { category: "Starters", name: "Smoked cod roe", description: "Rye crisp, dill oil, apple", priceMinor: 12000, featured: true },
      { category: "Mains", name: "Braised short rib", description: "Root vegetables, juniper jus", priceMinor: 24500 },
    ],
  },
  {
    slug: "gorms-pizza",
    name: "Gorm's Pizza",
    description: "Wood-fired pizza · Nørrebro, Copenhagen",
    phone: "+4570221199",
    address: "Fredensgade 12",
    city: "København",
    postalCode: "2200",
    latitude: 55.6915,
    longitude: 12.5595,
    rating: 3.9,
    averageWaitMinutes: 15,
    heroImageUrl: img("1555396273-367ea4eb4db5"),
    categories: [{ name: "Pizza", sortOrder: 1 }],
    items: [
      { category: "Pizza", name: "Hawaiian Pizza", description: "Tomato base, mozzarella, ham, pineapple. A polarising classic.", priceMinor: 8900, featured: true, imageUrl: img("1513104890138-7c749659a591") },
      { category: "Pizza", name: "Diavola", description: "Spicy salami, chili, mozzarella", priceMinor: 10500 },
    ],
  },
  {
    slug: "torvehallerne-grill",
    name: "Torvehallerne Grill",
    description: "Street food & grill · Indre By, Copenhagen",
    phone: "+4560554477",
    address: "Frederiksborggade 21",
    city: "København",
    postalCode: "1360",
    latitude: 55.6835,
    longitude: 12.57,
    rating: 4.1,
    averageWaitMinutes: 10,
    heroImageUrl: img("1466978913421-dad2ebd01d17"),
    categories: [{ name: "Grill", sortOrder: 1 }],
    items: [
      { category: "Grill", name: "Porchetta sandwich", description: "Slow-roast pork, salsa verde, crackling", priceMinor: 9500, featured: true },
      { category: "Grill", name: "Smash burger", description: "Double patty, cheese, pickles", priceMinor: 11000, imageUrl: img("1568901346375-23c9450c58cd") },
    ],
  },
];

async function upsertRestaurant(restaurant: SeedRestaurant) {
  const result = await pool.query<IdRow>(
    `INSERT INTO restaurants (name, slug, description, phone, address, city, postal_code, country_code,
       hero_image_url, queue_enabled, average_wait_minutes, currency, latitude, longitude, rating, is_active)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'DK', $8, true, $9, 'DKK', $10, $11, $12, true)
     ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           description = EXCLUDED.description,
           phone = EXCLUDED.phone,
           address = EXCLUDED.address,
           city = EXCLUDED.city,
           postal_code = EXCLUDED.postal_code,
           hero_image_url = EXCLUDED.hero_image_url,
           average_wait_minutes = EXCLUDED.average_wait_minutes,
           latitude = EXCLUDED.latitude,
           longitude = EXCLUDED.longitude,
           rating = EXCLUDED.rating,
           updated_at = now()
     RETURNING id`,
    [
      restaurant.name,
      restaurant.slug,
      restaurant.description,
      restaurant.phone,
      restaurant.address,
      restaurant.city,
      restaurant.postalCode,
      restaurant.heroImageUrl,
      restaurant.averageWaitMinutes,
      restaurant.latitude,
      restaurant.longitude,
      restaurant.rating,
    ],
  );
  return result.rows[0]!.id;
}

async function seedMenu(restaurantId: string, restaurant: SeedRestaurant) {
  const categoryIds = new Map<string, string>();
  for (const category of restaurant.categories) {
    const existing = await pool.query<IdRow>(
      "SELECT id FROM menu_categories WHERE restaurant_id = $1 AND name = $2",
      [restaurantId, category.name],
    );
    if (existing.rows[0]) {
      categoryIds.set(category.name, existing.rows[0].id);
      continue;
    }
    const inserted = await pool.query<IdRow>(
      `INSERT INTO menu_categories (restaurant_id, name, sort_order)
       VALUES ($1, $2, $3) RETURNING id`,
      [restaurantId, category.name, category.sortOrder],
    );
    categoryIds.set(category.name, inserted.rows[0]!.id);
  }

  for (const [index, item] of restaurant.items.entries()) {
    await pool.query(
      `INSERT INTO menu_items (restaurant_id, category_id, name, description, price_minor,
         currency, image_url, is_featured, sort_order)
       SELECT $1, $2, $3, $4, $5, 'DKK', $6, $7, $8
       WHERE NOT EXISTS (
         SELECT 1 FROM menu_items WHERE restaurant_id = $1 AND name = $3
       )`,
      [
        restaurantId,
        categoryIds.get(item.category),
        item.name,
        item.description,
        item.priceMinor,
        item.imageUrl ?? null,
        item.featured ?? false,
        index,
      ],
    );
  }
}

async function seed() {
  const restaurantIds = new Map<string, string>();
  for (const restaurant of restaurants) {
    const id = await upsertRestaurant(restaurant);
    restaurantIds.set(restaurant.slug, id);
    await seedMenu(id, restaurant);
  }

  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10);
  const user = await pool.query<IdRow>(
    `INSERT INTO users (email, password_hash, display_name)
     VALUES ($1, $2, 'Spisnem Admin')
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash, updated_at = now()
     RETURNING id`,
    [env.SEED_ADMIN_EMAIL, passwordHash],
  );
  const userId = user.rows[0]!.id;

  await pool.query(
    `INSERT INTO restaurant_users (user_id, restaurant_id, role)
     VALUES ($1, $2, 'owner')
     ON CONFLICT (user_id, restaurant_id) DO UPDATE SET role = EXCLUDED.role`,
    [userId, restaurantIds.get("spisnem")],
  );

  console.log(`seeded ${restaurants.length} restaurants and admin ${env.SEED_ADMIN_EMAIL}`);
}

try {
  await seed();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
