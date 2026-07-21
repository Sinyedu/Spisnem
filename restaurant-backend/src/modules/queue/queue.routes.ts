import type { FastifyInstance } from "fastify";
import { idParamSchema, tokenParamSchema } from "../../shared/schemas.js";
import { slugParamSchema } from "../restaurants/restaurant.schemas.js";
import { joinQueueSchema, updateQueueStatusSchema } from "./queue.schemas.js";
import {
  cancelQueueEntryByToken,
  changeQueueStatus,
  getQueueEntryByToken,
  getStaffQueue,
  joinQueue,
} from "./queue.service.js";

export async function publicQueueRoutes(app: FastifyInstance) {
  app.post("/restaurants/:slug/queue", async (request, reply) => {
    const { slug } = slugParamSchema.parse(request.params);
    const input = joinQueueSchema.parse(request.body);
    const entry = await joinQueue(slug, input);
    return reply.status(201).send({ data: entry });
  });

  app.get("/queue/:token", async (request) => {
    const { token } = tokenParamSchema.parse(request.params);
    return { data: await getQueueEntryByToken(token) };
  });

  app.post("/queue/:token/cancel", async (request) => {
    const { token } = tokenParamSchema.parse(request.params);
    return { data: await cancelQueueEntryByToken(token) };
  });
}

export async function staffQueueRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  app.get("/", async (request) => {
    return { data: await getStaffQueue(request.user.restaurantId) };
  });

  app.patch("/:id/status", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const { status } = updateQueueStatusSchema.parse(request.body);
    return { data: await changeQueueStatus(request.user.restaurantId, id, status) };
  });
}
