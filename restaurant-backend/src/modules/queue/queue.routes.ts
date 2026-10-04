import type { FastifyInstance } from "fastify";
import { getCustomerUserId } from "../../shared/customer-session.js";
import { tokenParamSchema } from "../../shared/schemas.js";
import { slugParamSchema } from "../restaurants/restaurant.schemas.js";
import { estimateQuerySchema, joinQueueSchema, lateSchema } from "./queue.schemas.js";
import {
  cancelQueueEntryByToken,
  estimateWaitForSlug,
  getQueueEntryByToken,
  joinQueue,
  reportLate,
  reportOnMyWay,
} from "./queue.service.js";

export async function publicQueueRoutes(app: FastifyInstance) {
  // What a party of this size would be quoted right now, before they join.
  app.get("/restaurants/:slug/queue/estimate", async (request) => {
    const { slug } = slugParamSchema.parse(request.params);
    const { partySize } = estimateQuerySchema.parse(request.query);
    return { data: await estimateWaitForSlug(slug, partySize) };
  });

  app.post("/restaurants/:slug/queue", async (request, reply) => {
    const { slug } = slugParamSchema.parse(request.params);
    const input = joinQueueSchema.parse(request.body);
    // Signed-in guests get the visit in their history; everyone else joins anonymously.
    const entry = await joinQueue(slug, input, await getCustomerUserId(request));
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

  app.post("/queue/:token/late", async (request) => {
    const { token } = tokenParamSchema.parse(request.params);
    const { minutes } = lateSchema.parse(request.body);
    return { data: await reportLate(token, minutes) };
  });

  app.post("/queue/:token/on-my-way", async (request) => {
    const { token } = tokenParamSchema.parse(request.params);
    return { data: await reportOnMyWay(token) };
  });
}
