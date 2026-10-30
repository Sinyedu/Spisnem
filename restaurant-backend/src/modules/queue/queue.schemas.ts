import { z } from "zod";
import { queueStateSchema } from "../restaurants/restaurant.schemas.js";

const partySize = z.number().int().min(1).max(20);
const waitMinutes = z.number().int().min(0).max(240);

export const joinQueueSchema = z.object({
  guestName: z.string().min(1).max(100),
  phone: z.string().min(4).max(30).optional(),
  partySize,
  notes: z.string().max(500).optional(),
});

export const updateQueueStatusSchema = z.object({
  status: z.enum(["waiting", "notified", "seated", "cancelled", "no_show"]),
});

export const estimateQuerySchema = z.object({
  partySize: z.coerce.number().int().min(1).max(20).default(2),
});

// "Running late" offers a few fixed choices rather than a free number.
export const lateSchema = z.object({
  minutes: z.union([z.literal(5), z.literal(10), z.literal(15)]),
});

export const walkInSchema = z.object({
  guestName: z.string().trim().max(100).optional(),
  phone: z.string().min(4).max(30).optional(),
  partySize,
  notes: z.string().max(500).optional(),
  quotedWaitMinutes: waitMinutes.optional(),
});

export const seatSchema = z.object({
  tableId: z.uuid().nullable().optional(),
});

export const extendSchema = z.object({
  minutes: z.number().int().min(1).max(30).optional(),
});

export const editEntrySchema = z.object({
  guestName: z.string().trim().min(1).max(100).optional(),
  partySize: partySize.optional(),
  notes: z.string().max(500).nullable().optional(),
  position: z.number().int().min(1).max(1000).optional(),
  quotedWaitMinutes: waitMinutes.nullable().optional(),
});

export const queueSettingsSchema = z.object({
  queueState: queueStateSchema.optional(),
  averageWaitMinutes: z.number().int().min(1).max(240).optional(),
  graceMinutes: z.number().int().min(1).max(60).optional(),
  maxPartySize: partySize.optional(),
});
