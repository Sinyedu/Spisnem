import { pool } from "../../database/pool.js";
import type {
  Db,
  MapBounds,
  MapRestaurant,
  Restaurant,
  UpdateRestaurantProfileInput,
} from "../../types/index.js";

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
  latitude,
  longitude,
  queue_enabled AS "queueEnabled",
  average_wait_minutes AS "averageWaitMinutes",
  currency
`;

const profileColumns: Record<keyof UpdateRestaurantProfileInput, string> = {
  name: "name",
  description: "description",
  phone: "phone",
  address: "address",
  city: "city",
  postalCode: "postal_code",
  countryCode: "country_code",
  heroImageUrl: "hero_image_url",
  cuisine: "cuisine",
  priceLevel: "price_level",
  latitude: "latitude",
  longitude: "longitude",
  queueEnabled: "queue_enabled",
  averageWaitMinutes: "average_wait_minutes",
};

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
            hero_image_url AS "heroImageUrl", latitude, longitude
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

function buildProfileUpdate(input: UpdateRestaurantProfileInput) {
  const values: unknown[] = [];
  const assignments: string[] = [];

  for (const key of Object.keys(input) as (keyof UpdateRestaurantProfileInput)[]) {
    const value = input[key];
    if (value === undefined) continue;

    values.push(value);
    assignments.push(`${profileColumns[key]} = $${values.length}`);
  }

  return { assignments, values };
}

export async function updateRestaurantProfile(
  id: string,
  input: UpdateRestaurantProfileInput,
) {
  const { assignments, values } = buildProfileUpdate(input);
  if (assignments.length === 0) return findRestaurantById(id);

  const result = await pool.query<Restaurant>(
    `UPDATE restaurants
     SET ${assignments.join(", ")}, updated_at = now()
     WHERE id = $${values.length + 1}
     RETURNING ${restaurantColumns}`,
    [...values, id],
  );
  return result.rows[0] ?? null;
}
