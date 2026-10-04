import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireCustomerUserId } from "../../shared/customer-session.js";
import { deleteFavourite, getFavourites, getVisits, saveFavourite } from "./customer.service.js";

const restaurantParamSchema = z.object({ restaurantId: z.uuid() });

// Everything here needs a signed-in guest (Better Auth session cookie).
export async function customerRoutes(app: FastifyInstance) {
  app.get("/favourites", async (request) => {
    return { data: await getFavourites(await requireCustomerUserId(request)) };
  });

  app.put("/favourites/:restaurantId", async (request, reply) => {
    const { restaurantId } = restaurantParamSchema.parse(request.params);
    await saveFavourite(await requireCustomerUserId(request), restaurantId);
    return reply.status(204).send();
  });

  app.delete("/favourites/:restaurantId", async (request, reply) => {
    const { restaurantId } = restaurantParamSchema.parse(request.params);
    await deleteFavourite(await requireCustomerUserId(request), restaurantId);
    return reply.status(204).send();
  });

  app.get("/visits", async (request) => {
    return { data: await getVisits(await requireCustomerUserId(request)) };
  });
}
