import Fastify from "fastify";
import { env } from "./config/env.js";
import { registerCors } from "./plugins/cors.js";
import { registerDatabase } from "./plugins/database.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { healthRoutes } from "./modules/health/health.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  await registerCors(app);
  await registerDatabase(app);
  registerErrorHandler(app);

  await app.register(healthRoutes, { prefix: "/api/health" });

  return app;
}
