import { z } from "zod";

export const joinQueueSchema = z.object({
  guestName: z.string().min(1).max(100),
  phone: z.string().min(4).max(30).optional(),
  partySize: z.number().int().min(1).max(20),
  notes: z.string().max(500).optional(),
});

export const updateQueueStatusSchema = z.object({
  status: z.enum(["waiting", "notified", "seated", "cancelled", "no_show"]),
});
