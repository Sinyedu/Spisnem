import { z } from "zod";

export const slugParamSchema = z.object({
  slug: z.string().min(1).max(100),
});

export const restaurantSearchSchema = z.object({
  search: z.string().max(100).optional(),
});
