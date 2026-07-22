import bcrypt from "bcrypt";
import { pool } from "./pool.js";
import { env } from "../config/env.js";
import type { IdRow } from "../types/index.js";

const categories = [
  { name: "Pizza", sortOrder: 1 },
  { name: "Main dishes", sortOrder: 2 },
  { name: "Drinks", sortOrder: 3 },
];

const items = [
  { category: "Pizza", name: "Margherita", description: "Tomato, mozzarella, basil", priceMinor: 8900, featured: true },
  { category: "Pizza", name: "Pepperoni", description: "Tomato, mozzarella, pepperoni", priceMinor: 9900, featured: false },
  { category: "Pizza", name: "Vegetariana", description: "Seasonal vegetables", priceMinor: 9500, featured: false },
  { category: "Main dishes", name: "Burger and fries", description: "Beef patty, cheddar, house sauce", priceMinor: 12900, featured: true },
  { category: "Main dishes", name: "Grilled salmon", description: "Salmon, potatoes, dill", priceMinor: 16500, featured: false },
  { category: "Main dishes", name: "Caesar salad", description: "Romaine, parmesan, croutons", priceMinor: 8500, featured: false },
  { category: "Drinks", name: "Sparkling water", description: "50 cl", priceMinor: 2500, featured: false },
  { category: "Drinks", name: "Draft beer", description: "40 cl", priceMinor: 4500, featured: false },
  { category: "Drinks", name: "House lemonade", description: "Lemon and mint", priceMinor: 3500, featured: false },
];

async function seed() {
  const restaurant = await pool.query<IdRow>(
    `INSERT INTO restaurants (name, slug, description, phone, address, city, postal_code, country_code,
       queue_enabled, average_wait_minutes, currency, is_active)
     VALUES ('Spisnem', 'spisnem', 'Fresh food without the waiting line', '+4512345678',
       'Nørrebrogade 1', 'København', '2200', 'DK', true, 8, 'DKK', true)
     ON CONFLICT (slug) DO UPDATE
       SET name = EXCLUDED.name,
           queue_enabled = EXCLUDED.queue_enabled,
           average_wait_minutes = EXCLUDED.average_wait_minutes,
           updated_at = now()
     RETURNING id`,
    [],
  );
  const restaurantId = restaurant.rows[0]!.id;

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
    [userId, restaurantId],
  );

  const categoryIds = new Map<string, string>();
  for (const category of categories) {
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

  for (const [index, item] of items.entries()) {
    await pool.query(
      `INSERT INTO menu_items (restaurant_id, category_id, name, description, price_minor,
         currency, is_featured, sort_order)
       SELECT $1, $2, $3, $4, $5, 'DKK', $6, $7
       WHERE NOT EXISTS (
         SELECT 1 FROM menu_items WHERE restaurant_id = $1 AND name = $3
       )`,
      [
        restaurantId,
        categoryIds.get(item.category),
        item.name,
        item.description,
        item.priceMinor,
        item.featured,
        index,
      ],
    );
  }

  console.log(`seeded restaurant spisnem and admin ${env.SEED_ADMIN_EMAIL}`);
}

try {
  await seed();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
