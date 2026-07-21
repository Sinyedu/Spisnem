import type { FastifyInstance } from "fastify";
import { idParamSchema } from "../../shared/schemas.js";
import {
  createCategorySchema,
  createItemSchema,
  updateCategorySchema,
  updateItemSchema,
} from "./menu.schemas.js";
import {
  createCategory,
  createItem,
  editCategory,
  editItem,
  getStaffMenu,
} from "./menu.service.js";

export async function staffMenuRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  // Instance hooks run first, so authenticate has already filled request.user.
  const ownerOnly = { onRequest: [app.requireOwner] };

  app.get("/", async (request) => {
    return { data: await getStaffMenu(request.user.restaurantId) };
  });

  app.post("/categories", ownerOnly, async (request, reply) => {
    const input = createCategorySchema.parse(request.body);
    const category = await createCategory(request.user.restaurantId, input);
    return reply.status(201).send({ data: category });
  });

  app.patch("/categories/:id", ownerOnly, async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const input = updateCategorySchema.parse(request.body);
    return { data: await editCategory(request.user.restaurantId, id, input) };
  });

  app.post("/items", ownerOnly, async (request, reply) => {
    const input = createItemSchema.parse(request.body);
    const item = await createItem(request.user.restaurantId, input);
    return reply.status(201).send({ data: item });
  });

  app.patch("/items/:id", ownerOnly, async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const input = updateItemSchema.parse(request.body);
    return { data: await editItem(request.user.restaurantId, id, input) };
  });
}
