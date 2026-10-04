import type { FastifyInstance } from "fastify";
import { getDashboardSummary } from "./dashboard.service.js";

export async function dashboardRoutes(app: FastifyInstance) {
  app.get("/", { onRequest: [app.authenticate] }, async (request) => {
    return { data: await getDashboardSummary(request.user.restaurantId) };
  });
}
