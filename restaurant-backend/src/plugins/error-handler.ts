import type { FastifyError, FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { AppError } from "../shared/errors.js";

export function registerErrorHandler(app: FastifyInstance) {
  app.setNotFoundHandler((_request, reply) =>
    reply.status(404).send({
      error: { code: "NOT_FOUND", message: "Route not found" },
    }),
  );

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const { statusCode, code, message } = error;

    if (error instanceof AppError) {
      return reply
        .status(error.statusCode)
        .send({ error: { code: error.code, message: error.message } });
    }

    if (error instanceof ZodError) {
      const issue = error.issues[0];
      const path = issue?.path.join(".");
      return reply.status(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: issue ? `${path || "body"}: ${issue.message}` : "Invalid request",
        },
      });
    }

    if (statusCode && statusCode < 500) {
      return reply.status(statusCode).send({
        error: { code: code ?? "BAD_REQUEST", message },
      });
    }

    request.log.error(error);
    return reply.status(500).send({
      error: { code: "INTERNAL_ERROR", message: "Internal server error" },
    });
  });
}
