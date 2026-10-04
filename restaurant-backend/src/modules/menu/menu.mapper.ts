import type { MenuCategory, MenuCategoryDoc, MenuItem, MenuItemDoc } from "../../types/index.js";

export function toCategory(doc: MenuCategoryDoc): MenuCategory {
  return {
    id: doc._id,
    name: doc.name,
    description: doc.description,
    sortOrder: doc.sortOrder,
    isActive: doc.isActive,
  };
}

export function toItem(doc: MenuItemDoc): MenuItem {
  return {
    id: doc._id,
    categoryId: doc.categoryId,
    name: doc.name,
    description: doc.description,
    priceMinor: doc.priceMinor,
    currency: doc.currency,
    imageUrl: doc.imageUrl,
    isAvailable: doc.isAvailable,
    isFeatured: doc.isFeatured,
    sortOrder: doc.sortOrder,
  };
}
