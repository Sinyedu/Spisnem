import type { FastifyInstance } from "fastify";
import { idParamSchema, tokenParamSchema } from "../../shared/schemas.js";
import { slugParamSchema } from "../restaurants/restaurant.schemas.js";
import {
  createOrderSchema,
  orderListQuerySchema,
  updateOrderStatusSchema,
} from "./order.schemas.js";
import {
  changeOrderStatus,
  createOrder,
  getOrderByToken,
  getStaffOrder,
  getStaffOrders,
} from "./order.service.js";

export async function publicOrderRoutes(app: FastifyInstance) {
  app.post("/restaurants/:slug/orders", async (request, reply) => {
    const { slug } = slugParamSchema.parse(request.params);
    const input = createOrderSchema.parse(request.body);
    const order = await createOrder(slug, input);
    return reply.status(201).send({ data: order });
  });

  app.get("/orders/:token", async (request) => {
    const { token } = tokenParamSchema.parse(request.params);
    return { data: await getOrderByToken(token) };
  });
}

export async function staffOrderRoutes(app: FastifyInstance) {
  app.addHook("onRequest", app.authenticate);

  app.get("/", async (request) => {
    const { status } = orderListQuerySchema.parse(request.query);
    return { data: await getStaffOrders(request.user.restaurantId, status) };
  });

  app.get("/:id", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    return { data: await getStaffOrder(request.user.restaurantId, id) };
  });

  app.patch("/:id/status", async (request) => {
    const { id } = idParamSchema.parse(request.params);
    const { status } = updateOrderStatusSchema.parse(request.body);
    return { data: await changeOrderStatus(request.user.restaurantId, id, status) };
  });
}
