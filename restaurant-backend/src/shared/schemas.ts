import { z } from "zod";

export const idParamSchema = z.object({
  id: z.uuid(),
});

export const tokenParamSchema = z.object({
  token: z.string().min(10).max(200),
});
