import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { listEntriesJoinedBetween } from "../queue/queue.repository.js";
import { summarizeInsights } from "./insights.calculator.js";
import { resolveRange } from "./insights.range.js";

const insightsQuerySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export async function staffInsightsRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  // GET /api/staff/insights?from=ISO&to=ISO (both optional; defaults to today so far).
  app.get("/", async (request) => {
    const query = insightsQuerySchema.parse(request.query);
    const range = resolveRange(query.from, query.to);
    const entries = await listEntriesJoinedBetween(request.user.restaurantId, range.from, range.to);
    return { data: summarizeInsights(entries, range) };
  });
}
