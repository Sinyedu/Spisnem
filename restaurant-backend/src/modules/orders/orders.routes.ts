import type { FastifyInstance } from "fastify";

export async function orderRoutes(app: FastifyInstance) {
  app.post("/", async (request, reply) => {
    return reply.status(201).send({
      message: "Order created",
    });
  });
}
