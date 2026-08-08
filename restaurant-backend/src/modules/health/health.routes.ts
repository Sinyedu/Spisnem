import type { FastifyInstance } from "fastify";
//health routes
export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      status: "ok",
      service: "restaurant-backend",
    };
  });
}
