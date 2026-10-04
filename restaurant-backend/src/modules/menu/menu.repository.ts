import { menuCategories, menuItems } from "../../database/collections.js";
import { newId } from "../../shared/ids.js";
import { definedFields } from "../../shared/objects.js";
import type {
  CreateCategoryInput,
  CreateItemInput,
  MenuCategoryDoc,
  MenuItemDoc,
  UpdateCategoryInput,
  UpdateItemInput,
} from "../../types/index.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";
import { toCategory, toItem } from "./menu.mapper.js";

const byOrderThenName = { sortOrder: 1, name: 1 } as const;

export async function listCategories(restaurantId: string, onlyActive: boolean) {
  const filter = onlyActive ? { restaurantId, isActive: true } : { restaurantId };
  return (await menuCategories.find(filter).sort(byOrderThenName).toArray()).map(toCategory);
}

export async function listItems(restaurantId: string, onlyAvailable: boolean) {
  const filter = onlyAvailable ? { restaurantId, isAvailable: true } : { restaurantId };
  return (await menuItems.find(filter).sort(byOrderThenName).toArray()).map(toItem);
}

export async function findCategory(restaurantId: string, categoryId: string) {
  const doc = await menuCategories.findOne({ _id: categoryId, restaurantId });
  return doc ? toCategory(doc) : null;
}

export async function insertCategory(restaurantId: string, input: CreateCategoryInput) {
  const now = new Date();
  const doc: MenuCategoryDoc = {
    _id: newId(), restaurantId, name: input.name, description: input.description ?? null,
    sortOrder: input.sortOrder, isActive: true, createdAt: now, updatedAt: now,
  };
  await menuCategories.insertOne(doc);
  return toCategory(doc);
}

export async function updateCategory(restaurantId: string, categoryId: string, input: UpdateCategoryInput) {
  const doc = await menuCategories.findOneAndUpdate(
    { _id: categoryId, restaurantId },
    { $set: { ...definedFields(input), updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return doc ? toCategory(doc) : null;
}

// New items take the restaurant's currency, as the SQL version did.
export async function insertItem(restaurantId: string, input: CreateItemInput) {
  const restaurant = await findRestaurantById(restaurantId);
  const now = new Date();
  const doc: MenuItemDoc = {
    _id: newId(), restaurantId, categoryId: input.categoryId ?? null, name: input.name,
    description: input.description ?? null, priceMinor: input.priceMinor, currency: restaurant?.currency ?? "DKK",
    imageUrl: input.imageUrl ?? null, isAvailable: true, isFeatured: input.isFeatured,
    sortOrder: input.sortOrder, createdAt: now, updatedAt: now,
  };
  await menuItems.insertOne(doc);
  return toItem(doc);
}

export async function findItem(restaurantId: string, itemId: string) {
  const doc = await menuItems.findOne({ _id: itemId, restaurantId });
  return doc ? toItem(doc) : null;
}

export async function updateItem(restaurantId: string, itemId: string, input: UpdateItemInput) {
  const doc = await menuItems.findOneAndUpdate(
    { _id: itemId, restaurantId },
    { $set: { ...definedFields(input), updatedAt: new Date() } },
    { returnDocument: "after" },
  );
  return doc ? toItem(doc) : null;
}
