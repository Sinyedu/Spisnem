import { badRequest, notFound } from "../../shared/errors.js";
import type {
  CreateCategoryInput,
  CreateItemInput,
  Menu,
  UpdateCategoryInput,
  UpdateItemInput,
} from "../../types/index.js";
import {
  findCategory,
  insertCategory,
  insertItem,
  listCategories,
  listItems,
  updateCategory,
  updateItem,
} from "./menu.repository.js";

async function loadMenu(restaurantId: string, onlyActive: boolean): Promise<Menu> {
  const [categories, allItems] = await Promise.all([
    listCategories(restaurantId, onlyActive),
    listItems(restaurantId, onlyActive),
  ]);

  // On the public menu, items in a hidden category must stay hidden everywhere.
  const visibleCategoryIds = new Set(categories.map((category) => category.id));
  const items = onlyActive
    ? allItems.filter((item) => item.categoryId === null || visibleCategoryIds.has(item.categoryId))
    : allItems;

  return {
    categories: categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.categoryId === category.id),
    })),
    uncategorized: items.filter((item) => item.categoryId === null),
    featured: items.filter((item) => item.isFeatured),
  };
}

export function getPublicMenu(restaurantId: string) {
  return loadMenu(restaurantId, true);
}

export function getStaffMenu(restaurantId: string) {
  return loadMenu(restaurantId, false);
}

export function createCategory(restaurantId: string, input: CreateCategoryInput) {
  return insertCategory(restaurantId, input);
}

export async function editCategory(
  restaurantId: string,
  categoryId: string,
  input: UpdateCategoryInput,
) {
  const category = await updateCategory(restaurantId, categoryId, input);
  if (!category) throw notFound("Category not found");
  return category;
}

async function assertCategoryBelongsToRestaurant(restaurantId: string, categoryId?: string) {
  if (!categoryId) return;
  const category = await findCategory(restaurantId, categoryId);
  if (!category) {
    throw badRequest("Category does not belong to this restaurant", "INVALID_CATEGORY");
  }
}

export async function createItem(restaurantId: string, input: CreateItemInput) {
  await assertCategoryBelongsToRestaurant(restaurantId, input.categoryId);
  return insertItem(restaurantId, input);
}

export async function editItem(
  restaurantId: string,
  itemId: string,
  input: UpdateItemInput,
) {
  await assertCategoryBelongsToRestaurant(restaurantId, input.categoryId);

  const item = await updateItem(restaurantId, itemId, input);
  if (!item) throw notFound("Menu item not found");
  return item;
}
