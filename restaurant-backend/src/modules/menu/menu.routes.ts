import type { FastifyInstance } from "fastify";

export async function menuRoutes(app: FastifyInstance) {
  app.get("/", async () => {
    return [
      {
        id: "1",
        name: "Burger",
        price: 89,
        category: "Main",
      },
    ];
  });
}
