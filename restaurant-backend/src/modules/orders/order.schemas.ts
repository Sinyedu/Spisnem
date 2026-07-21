import { z } from "zod";

const orderStatusSchema = z.enum([
  "submitted",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
]);

export const createOrderSchema = z.object({
  customerName: z.string().min(1).max(100),
  queueToken: z.string().min(10).max(200).optional(),
  customerNotes: z.string().max(500).optional(),
  paymentMethod: z.enum(["pay_at_restaurant", "mock_card"]),
  items: z
    .array(
      z.object({
        menuItemId: z.uuid(),
        quantity: z.number().int().min(1).max(20),
        notes: z.string().max(200).optional(),
      }),
    )
    .min(1)
    .max(50),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export const orderListQuerySchema = z.object({
  status: orderStatusSchema.optional(),
});
