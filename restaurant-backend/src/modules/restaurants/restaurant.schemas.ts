import { z } from "zod";

export const slugParamSchema = z.object({
  slug: z.string().min(1).max(100),
});

export const restaurantSearchSchema = z.object({
  search: z.string().max(100).optional(),
});

const longitude = z.coerce.number().min(-180).max(180);
const latitude = z.coerce.number().min(-90).max(90);

export const mapBoundsSchema = z
  .object({
    west: longitude,
    south: latitude,
    east: longitude,
    north: latitude,
    limit: z.coerce.number().int().min(1).max(100).default(50),
  })
  .refine((bounds) => bounds.west <= bounds.east, {
    message: "west must be less than or equal to east",
    path: ["west"],
  })
  .refine((bounds) => bounds.south <= bounds.north, {
    message: "south must be less than or equal to north",
    path: ["south"],
  });
