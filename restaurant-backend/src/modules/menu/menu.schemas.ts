import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
  isActive: z.boolean().optional(),
});

export const createItemSchema = z.object({
  categoryId: z.uuid().optional(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  priceMinor: z.number().int().min(0).max(1_000_000),
  imageUrl: z.url().max(500).optional(),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});

export const updateItemSchema = z.object({
  categoryId: z.uuid().optional(),
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  priceMinor: z.number().int().min(0).max(1_000_000).optional(),
  imageUrl: z.url().max(500).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});
