import { z } from "zod";

export const queueStateSchema = z.enum(["open", "paused", "closed"]);

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

const nullableText = (max: number) => z.string().trim().min(1).max(max).nullable().optional();

export const updateRestaurantProfileSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: nullableText(1000),
  phone: nullableText(30),
  address: nullableText(200),
  city: nullableText(100),
  postalCode: nullableText(20),
  countryCode: z.string().trim().length(2).toUpperCase().optional(),
  heroImageUrl: z.url().max(1000).nullable().optional(),
  cuisine: nullableText(100),
  priceLevel: z.number().int().min(1).max(4).nullable().optional(),
  latitude: latitude.nullable().optional(),
  longitude: longitude.nullable().optional(),
  queueEnabled: z.boolean().optional(),
  queueState: queueStateSchema.optional(),
  averageWaitMinutes: z.number().int().min(1).max(240).optional(),
  graceMinutes: z.number().int().min(1).max(60).optional(),
  maxPartySize: z.number().int().min(1).max(20).optional(),
});
