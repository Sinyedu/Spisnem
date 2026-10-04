import type { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { unauthorized } from "../../shared/errors.js";
import { subscribeToChanges } from "../../shared/live-bus.js";
import { tokenParamSchema } from "../../shared/schemas.js";
import { openSseStream } from "../../shared/sse.js";
import type { StaffToken } from "../../types/index.js";
import { getQueueEntryByToken, loadEntryByToken } from "../queue/queue.service.js";

// Browsers' EventSource can't send headers, so the staff token travels in the query string.
const streamAuthSchema = z.object({ access_token: z.string().min(10) });

/** A guest's ticket, pushed again whenever anything in that restaurant's line moves. */
export async function publicLiveRoutes(app: FastifyInstance) {
  app.get("/queue/:token/stream", async (request, reply) => {
    const { token } = tokenParamSchema.parse(request.params);
    const entry = await loadEntryByToken(token);
    const stream = openSseStream(request, reply);
    const push = async () => stream.send("entry", await getQueueEntryByToken(token));
    await push();
    stream.onClose(subscribeToChanges(entry.restaurantId, () => stream.schedule(push)));
  });
}

async function verifyStreamToken(app: FastifyInstance, request: FastifyRequest) {
  const { access_token: accessToken } = streamAuthSchema.parse(request.query);
  try {
    return app.jwt.verify<StaffToken>(accessToken);
  } catch {
    throw unauthorized("Invalid or missing token");
  }
}

/** Tells every open dashboard what changed, so each screen refetches just that part. */
export async function staffLiveRoutes(app: FastifyInstance) {
  app.get("/", async (request, reply) => {
    const user = await verifyStreamToken(app, request);
    const stream = openSseStream(request, reply);
    stream.send("ready", { restaurantId: user.restaurantId });
    stream.onClose(subscribeToChanges(user.restaurantId, (change) => stream.send("change", change)));
  });
}
