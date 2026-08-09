import { pool } from "../../database/pool.js";
import type { Db, MapBounds, MapRestaurant, Restaurant } from "../../types/index.js";

const restaurantColumns = `
  id,
  name,
  slug,
  description,
  phone,
  address,
  city,
  postal_code AS "postalCode",
  country_code AS "countryCode",
  hero_image_url AS "heroImageUrl",
  cuisine,
  price_level AS "priceLevel",
  cover_image_url AS "coverImageUrl",
  queue_enabled AS "queueEnabled",
  average_wait_minutes AS "averageWaitMinutes",
  currency
`;

export async function listActiveRestaurants(search: string | null) {
  const result = await pool.query<Restaurant>(
    `SELECT ${restaurantColumns}
     FROM restaurants
     WHERE is_active = true
       AND ($1::text IS NULL OR name ILIKE '%' || $1 || '%' OR city ILIKE '%' || $1 || '%')
     ORDER BY name`,
    [search],
  );
  return result.rows;
}

export async function findActiveRestaurantBySlug(slug: string, db: Db = pool) {
  const result = await db.query<Restaurant>(
    `SELECT ${restaurantColumns}
     FROM restaurants
     WHERE slug = $1 AND is_active = true`,
    [slug],
  );
  return result.rows[0] ?? null;
}

export async function listActiveRestaurantsInBounds(bounds: MapBounds) {
  const result = await pool.query<MapRestaurant>(
    `SELECT id, name, slug, cuisine, price_level AS "priceLevel",
            cover_image_url AS "coverImageUrl", latitude, longitude
     FROM restaurants
     WHERE is_active = true
       AND latitude BETWEEN $1 AND $2
       AND longitude BETWEEN $3 AND $4
     ORDER BY name
     LIMIT $5`,
    [bounds.south, bounds.north, bounds.west, bounds.east, bounds.limit],
  );
  return result.rows;
}

export async function findRestaurantById(id: string) {
  const result = await pool.query<Restaurant>(
    `SELECT ${restaurantColumns} FROM restaurants WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}
