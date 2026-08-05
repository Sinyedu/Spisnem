import type { FastifyInstance } from "fastify";
import { getPublicMenu } from "../menu/menu.service.js";
import { restaurantSearchSchema, slugParamSchema } from "./restaurant.schemas.js";
import {
  getRestaurantBySlug,
  getRestaurantDetailBySlug,
  getRestaurants,
} from "./restaurant.service.js";

export async function publicRestaurantRoutes(app: FastifyInstance) {
  app.get("/restaurants", async (request) => {
    const { search } = restaurantSearchSchema.parse(request.query);
    return { data: await getRestaurants(search) };
  });

  app.get("/restaurants/:slug", async (request) => {
    const { slug } = slugParamSchema.parse(request.params);
    return { data: await getRestaurantDetailBySlug(slug) };
  });

  app.get("/restaurants/:slug/menu", async (request) => {
    const { slug } = slugParamSchema.parse(request.params);
    const restaurant = await getRestaurantBySlug(slug);
    return { data: await getPublicMenu(restaurant.id) };
  });
}
