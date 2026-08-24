import Fastify from "fastify";
import { env } from "./config/env.js";
import { registerAuth } from "./plugins/auth.js";
import { registerCors } from "./plugins/cors.js";
import { registerDatabase } from "./plugins/database.js";
import { registerErrorHandler } from "./plugins/error-handler.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { CUSTOMER_AUTH_BASE_PATH } from "./modules/customer-auth/customer-auth.config.js";
import { customerAuthRoutes } from "./modules/customer-auth/customer-auth.routes.js";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes.js";
import { healthRoutes } from "./modules/health/health.routes.js";
import { staffMenuRoutes } from "./modules/menu/menu.routes.js";
import { publicQueueRoutes, staffQueueRoutes } from "./modules/queue/queue.routes.js";
import {
  publicRestaurantRoutes,
  staffRestaurantRoutes,
} from "./modules/restaurants/restaurant.routes.js";
import { publicSummaryRoutes } from "./modules/summary/summary.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV !== "test",
  });

  await registerCors(app);
  await registerAuth(app);
  await registerDatabase(app);
  registerErrorHandler(app);

  await app.register(healthRoutes, { prefix: "/api/health" });
  await app.register(authRoutes, { prefix: "/api/auth" });
  await app.register(customerAuthRoutes, { prefix: CUSTOMER_AUTH_BASE_PATH });

  await app.register(publicSummaryRoutes, { prefix: "/api/public" });
  await app.register(publicRestaurantRoutes, { prefix: "/api/public" });
  await app.register(publicQueueRoutes, { prefix: "/api/public" });

  await app.register(staffQueueRoutes, { prefix: "/api/staff/queue" });
  await app.register(staffRestaurantRoutes, { prefix: "/api/staff/restaurants" });
  await app.register(staffMenuRoutes, { prefix: "/api/staff/menu" });
  await app.register(dashboardRoutes, { prefix: "/api/staff/dashboard" });

  return app;
}
