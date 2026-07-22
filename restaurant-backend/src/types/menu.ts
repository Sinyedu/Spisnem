export type MenuCategory = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type MenuItem = {
  id: string;
  categoryId: string | null;
  name: string;
  description: string | null;
  priceMinor: number;
  currency: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type MenuCategoryWithItems = MenuCategory & { items: MenuItem[] };

export type Menu = {
  categories: MenuCategoryWithItems[];
  uncategorized: MenuItem[];
  featured: MenuItem[];
};

export type CreateCategoryInput = {
  name: string;
  description?: string | undefined;
  sortOrder: number;
};

// Fields that are left out stay unchanged.
export type UpdateCategoryInput = {
  name?: string | undefined;
  description?: string | undefined;
  sortOrder?: number | undefined;
  isActive?: boolean | undefined;
};

export type CreateItemInput = {
  categoryId?: string | undefined;
  name: string;
  description?: string | undefined;
  priceMinor: number;
  imageUrl?: string | undefined;
  isFeatured: boolean;
  sortOrder: number;
};

export type UpdateItemInput = {
  categoryId?: string | undefined;
  name?: string | undefined;
  description?: string | undefined;
  priceMinor?: number | undefined;
  imageUrl?: string | undefined;
  isAvailable?: boolean | undefined;
  isFeatured?: boolean | undefined;
  sortOrder?: number | undefined;
};
