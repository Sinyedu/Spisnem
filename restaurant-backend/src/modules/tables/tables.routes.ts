import type { FastifyInstance } from "fastify";
import { assertOwner } from "../../shared/roles.js";
import { idParamSchema } from "../../shared/schemas.js";
import { createTableSchema, updateTableSchema } from "./tables.schemas.js";
import { createTable, editTable, getTables, removeTable } from "./tables.service.js";

export async function staffTableRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  // Anyone on shift can change a table's status; only owners change the floor itself.
  const ownerOnly = { onRequest: [app.requireOwner] };

  app.get("/", async (request) => {
    return { data: await getTables(request.user.restaurantId) };
  });

  app.post("/", ownerOnly, async (request, reply) => {
    const input = createTableSchema.parse(request.body);
    return reply.status(201).send({ data: await createTable(request.user.restaurantId, input) });
  });

  app.patch("/:id", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const input = updateTableSchema.parse(request.body);
    const isLayoutChange = input.label !== undefined || input.seats !== undefined || input.sortOrder !== undefined;
    if (isLayoutChange) assertOwner(request.user);
    return { data: await editTable(request.user.restaurantId, id, input, request.user.userId) };
  });

  app.delete("/:id", ownerOnly, async (request, reply) => {
    const { id } = idParamSchema.parse(request.params);
    await removeTable(request.user.restaurantId, id);
    return reply.status(204).send();
  });
}
