import type { FastifyInstance } from "fastify";
//health route
export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return {
      status: "ok",
      service: "restaurant-backend",
    };
  });
}
