import type { FastifyInstance } from "fastify";
import { getPublicSummary } from "./summary.service.js";

export async function publicSummaryRoutes(app: FastifyInstance) {
  app.get("/summary", async () => {
    return { data: await getPublicSummary() };
  });
}
