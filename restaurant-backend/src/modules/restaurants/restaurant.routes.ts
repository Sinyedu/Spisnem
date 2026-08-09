import type { FastifyInstance } from "fastify";
import { getPublicMenu } from "../menu/menu.service.js";
import { mapBoundsSchema, restaurantSearchSchema, slugParamSchema } from "./restaurant.schemas.js";
import { getRestaurantBySlug, getRestaurants, getRestaurantsInBounds } from "./restaurant.service.js";

export async function publicRestaurantRoutes(app: FastifyInstance) {
  app.get("/restaurants", async (request) => {
    const { search } = restaurantSearchSchema.parse(request.query);
    return { data: await getRestaurants(search) };
  });

  // Returns a bare FeatureCollection rather than the usual { data } envelope so the
  // response can be handed straight to a MapLibre GeoJSON source.
  app.get("/restaurants/map", async (request) => {
    return getRestaurantsInBounds(mapBoundsSchema.parse(request.query));
  });

  app.get("/restaurants/:slug", async (request) => {
    const { slug } = slugParamSchema.parse(request.params);
    return { data: await getRestaurantBySlug(slug) };
  });

  app.get("/restaurants/:slug/menu", async (request) => {
    const { slug } = slugParamSchema.parse(request.params);
    const restaurant = await getRestaurantBySlug(slug);
    return { data: await getPublicMenu(restaurant.id) };
  });
}
