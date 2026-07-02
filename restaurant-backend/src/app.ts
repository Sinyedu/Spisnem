import Fastify from "fastify";
import { registerCors } from "./plugins/cors";
import { registerErrorHandler } from "./plugins/error-handler";
import { healthRoutes } from "./modules/health/health.routes";
import { tableRoutes } from "./modules/tables/tables.routes";
import { menuRoutes } from "./modules/menu/menu.routes";
import { orderRoutes } from "./modules/orders/orders.routes";
import { restaurantRoutes } from "./modules/restaurants/restaurant.routes";

export function buildApp() {
  const app = Fastify({
    logger: true,
  });

  registerCors(app);
  registerErrorHandler(app);

  app.register(healthRoutes, { prefix: "/api/health" });
  app.register(restaurantRoutes, { prefix: "/api/restaurants" });
  app.register(tableRoutes, { prefix: "/api/tables" });
  app.register(menuRoutes, { prefix: "/api/menu" });
  app.register(orderRoutes, { prefix: "/api/orders" });

  return app;
}
