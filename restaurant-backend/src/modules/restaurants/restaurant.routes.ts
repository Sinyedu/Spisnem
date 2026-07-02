import type { FastifyInstance } from "fastify";

export async function restaurantRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      message: "Restaurant routes coming soon",
    };
  });
}
