import type { FastifyInstance } from "fastify";
import { placesQuerySchema } from "./places.schemas.js";
import { getFoodPlaces } from "./places.service.js";

export async function publicPlacesRoutes(app: FastifyInstance) {
  app.get("/places", async (request) => {
    const { lat, lng, radius } = placesQuerySchema.parse(request.query);
    return { data: await getFoodPlaces(lat, lng, radius) };
  });
}
