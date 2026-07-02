import type { FastifyInstance } from "fastify";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    return reply.status(500).send({
      message: "Internal server error",
    });
  });
}
