import { z } from "zod";

export const tableStatusSchema = z.enum(["free", "seated", "soon", "blocked"]);

export const createTableSchema = z.object({
  label: z.string().trim().min(1).max(20),
  seats: z.number().int().min(1).max(20),
  sortOrder: z.number().int().min(0).max(1000).default(0),
});

export const updateTableSchema = z.object({
  label: z.string().trim().min(1).max(20).optional(),
  seats: z.number().int().min(1).max(20).optional(),
  status: tableStatusSchema.optional(),
  sortOrder: z.number().int().min(0).max(1000).optional(),
});
