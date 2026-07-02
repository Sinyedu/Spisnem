import type { FastifyInstance } from "fastify";

export async function tableRoutes(app: FastifyInstance) {
  app.get("/:tableId", async (request) => {
    const { tableId } = request.params as { tableId: string };

    return {
      tableId,
      status: "available",
    };
  });
}
// needs more
