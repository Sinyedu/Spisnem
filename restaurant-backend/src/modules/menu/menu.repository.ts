import { pool } from "../../database/pool.js";
import type {
  CreateCategoryInput,
  CreateItemInput,
  Db,
  MenuCategory,
  MenuItem,
  UpdateCategoryInput,
  UpdateItemInput,
} from "../../types/index.js";

const categoryColumns = `
  id, name, description, sort_order AS "sortOrder", is_active AS "isActive"
`;

const itemColumns = `
  id,
  category_id AS "categoryId",
  name,
  description,
  price_minor AS "priceMinor",
  currency,
  image_url AS "imageUrl",
  is_available AS "isAvailable",
  is_featured AS "isFeatured",
  sort_order AS "sortOrder"
`;

export async function listCategories(restaurantId: string, onlyActive: boolean) {
  const result = await pool.query<MenuCategory>(
    `SELECT ${categoryColumns}
     FROM menu_categories
     WHERE restaurant_id = $1 AND ($2 = false OR is_active = true)
     ORDER BY sort_order, name`,
    [restaurantId, onlyActive],
  );
  return result.rows;
}

export async function listItems(restaurantId: string, onlyAvailable: boolean) {
  const result = await pool.query<MenuItem>(
    `SELECT ${itemColumns}
     FROM menu_items
     WHERE restaurant_id = $1 AND ($2 = false OR is_available = true)
     ORDER BY sort_order, name`,
    [restaurantId, onlyAvailable],
  );
  return result.rows;
}

export async function findCategory(restaurantId: string, categoryId: string) {
  const result = await pool.query<MenuCategory>(
    `SELECT ${categoryColumns}
     FROM menu_categories
     WHERE restaurant_id = $1 AND id = $2`,
    [restaurantId, categoryId],
  );
  return result.rows[0] ?? null;
}

export async function insertCategory(restaurantId: string, input: CreateCategoryInput) {
  const result = await pool.query<MenuCategory>(
    `INSERT INTO menu_categories (restaurant_id, name, description, sort_order)
     VALUES ($1, $2, $3, $4)
     RETURNING ${categoryColumns}`,
    [restaurantId, input.name, input.description ?? null, input.sortOrder],
  );
  return result.rows[0]!;
}

// COALESCE keeps the current value whenever a field is not sent.
export async function updateCategory(
  restaurantId: string,
  categoryId: string,
  input: UpdateCategoryInput,
) {
  const result = await pool.query<MenuCategory>(
    `UPDATE menu_categories
     SET name = COALESCE($3, name),
         description = COALESCE($4, description),
         sort_order = COALESCE($5, sort_order),
         is_active = COALESCE($6, is_active),
         updated_at = now()
     WHERE restaurant_id = $1 AND id = $2
     RETURNING ${categoryColumns}`,
    [
      restaurantId,
      categoryId,
      input.name ?? null,
      input.description ?? null,
      input.sortOrder ?? null,
      input.isActive ?? null,
    ],
  );
  return result.rows[0] ?? null;
}

export async function insertItem(restaurantId: string, input: CreateItemInput) {
  const result = await pool.query<MenuItem>(
    `INSERT INTO menu_items
       (restaurant_id, category_id, name, description, price_minor, currency, image_url, is_featured, sort_order)
     SELECT $1, $2, $3, $4, $5, r.currency, $6, $7, $8
     FROM restaurants r
     WHERE r.id = $1
     RETURNING ${itemColumns}`,
    [
      restaurantId,
      input.categoryId ?? null,
      input.name,
      input.description ?? null,
      input.priceMinor,
      input.imageUrl ?? null,
      input.isFeatured,
      input.sortOrder,
    ],
  );
  return result.rows[0]!;
}

export async function findItem(restaurantId: string, itemId: string) {
  const result = await pool.query<MenuItem>(
    `SELECT ${itemColumns} FROM menu_items WHERE restaurant_id = $1 AND id = $2`,
    [restaurantId, itemId],
  );
  return result.rows[0] ?? null;
}

export async function updateItem(
  restaurantId: string,
  itemId: string,
  input: UpdateItemInput,
) {
  const result = await pool.query<MenuItem>(
    `UPDATE menu_items
     SET category_id = COALESCE($3, category_id),
         name = COALESCE($4, name),
         description = COALESCE($5, description),
         price_minor = COALESCE($6, price_minor),
         image_url = COALESCE($7, image_url),
         is_available = COALESCE($8, is_available),
         is_featured = COALESCE($9, is_featured),
         sort_order = COALESCE($10, sort_order),
         updated_at = now()
     WHERE restaurant_id = $1 AND id = $2
     RETURNING ${itemColumns}`,
    [
      restaurantId,
      itemId,
      input.categoryId ?? null,
      input.name ?? null,
      input.description ?? null,
      input.priceMinor ?? null,
      input.imageUrl ?? null,
      input.isAvailable ?? null,
      input.isFeatured ?? null,
      input.sortOrder ?? null,
    ],
  );
  return result.rows[0] ?? null;
}

export async function findItemsForOrder(restaurantId: string, itemIds: string[], db: Db) {
  const result = await db.query<MenuItem>(
    `SELECT ${itemColumns}
     FROM menu_items
     WHERE restaurant_id = $1 AND id = ANY($2::uuid[])`,
    [restaurantId, itemIds],
  );
  return result.rows;
}
