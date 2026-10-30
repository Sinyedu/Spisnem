import type { FastifyInstance } from "fastify";
import { idParamSchema } from "../../shared/schemas.js";
import {
  editEntrySchema,
  extendSchema,
  queueSettingsSchema,
  seatSchema,
  updateQueueStatusSchema,
  walkInSchema,
} from "./queue.schemas.js";
import { changeQueueStatus, editEntry, updateQueueSettings } from "./queue-staff-edit.service.js";
import {
  addWalkIn,
  callEntry,
  cancelEntry,
  DEFAULT_EXTEND_MINUTES,
  extendGrace,
  getStaffQueue,
  markNoShow,
  seatEntry,
} from "./queue-staff.service.js";

// Calling a guest in, and what happens while they walk over.
function registerCallRoutes(app: FastifyInstance) {
  app.post("/:id/call", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    return { data: await callEntry(request.user.restaurantId, id, request.user.userId) };
  });

  app.post("/:id/extend", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const { minutes } = extendSchema.parse(request.body ?? {});
    const data = await extendGrace(request.user.restaurantId, id, minutes ?? DEFAULT_EXTEND_MINUTES, request.user.userId);
    return { data };
  });

  app.post("/:id/no-show", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    return { data: await markNoShow(request.user.restaurantId, id, request.user.userId) };
  });
}

// Ending a visit: seated (optionally at a table) or taken off the list.
function registerFinishRoutes(app: FastifyInstance) {
  app.post("/:id/seat", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const { tableId } = seatSchema.parse(request.body ?? {});
    return { data: await seatEntry(request.user.restaurantId, id, tableId ?? null, request.user.userId) };
  });

  app.post("/:id/cancel", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    return { data: await cancelEntry(request.user.restaurantId, id, request.user.userId) };
  });
}

export async function staffQueueRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  app.get("/", async (request) => ({ data: await getStaffQueue(request.user.restaurantId) }));

  app.post("/", async (request, reply) => {
    const input = walkInSchema.parse(request.body);
    const entry = await addWalkIn(request.user.restaurantId, input, request.user.userId);
    return reply.status(201).send({ data: entry });
  });

  app.patch("/settings", async (request) => {
    const input = queueSettingsSchema.parse(request.body);
    return { data: await updateQueueSettings(request.user.restaurantId, input) };
  });

  app.patch("/:id", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const input = editEntrySchema.parse(request.body);
    return { data: await editEntry(request.user.restaurantId, id, input, request.user.userId) };
  });

  // Each action also writes the queue diary and pings live screens.
  registerCallRoutes(app);
  registerFinishRoutes(app);

  // Kept for the existing dashboard; new code uses the action endpoints above.
  app.patch("/:id/status", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const { status } = updateQueueStatusSchema.parse(request.body);
    return { data: await changeQueueStatus(request.user.restaurantId, id, status, request.user.userId) };
  });
}
