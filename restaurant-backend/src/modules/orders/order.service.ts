import { badRequest, notFound } from "../../shared/errors.js";
import { createPublicToken, hashPublicToken } from "../../shared/public-token.js";
import { assertTransition, canTransition } from "../../shared/status.js";
import { withTransaction } from "../../shared/transaction.js";
import type {
  CreateOrderInput,
  CreateOrderItemInput,
  MenuItem,
  OrderLine,
  OrderStatus,
  TransitionMap,
} from "../../types/index.js";
import { findItemsForOrder } from "../menu/menu.repository.js";
import { findQueueEntryByTokenHashForRestaurant } from "../queue/queue.repository.js";
import { findActiveRestaurantBySlug } from "../restaurants/restaurant.repository.js";
import {
  findOrderById,
  findOrderByTokenHash,
  insertOrder,
  insertOrderItem,
  listOrderItems,
  listOrders,
  updateOrderStatus,
} from "./order.repository.js";

export const orderTransitions: TransitionMap<OrderStatus> = {
  submitted: ["confirmed", "cancelled"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

export function canChangeOrderStatus(from: OrderStatus, to: OrderStatus) {
  return canTransition(orderTransitions, from, to);
}

// Prices always come from the database rows, never from the request body.
export function buildOrderLines(
  requested: CreateOrderItemInput[],
  menuItems: MenuItem[],
) {
  const byId = new Map(menuItems.map((item) => [item.id, item]));

  const lines: OrderLine[] = requested.map((line) => {
    const menuItem = byId.get(line.menuItemId);
    if (!menuItem) {
      throw badRequest(`Menu item ${line.menuItemId} is not on this menu`, "INVALID_MENU_ITEM");
    }
    if (!menuItem.isAvailable) {
      throw badRequest(`${menuItem.name} is not available right now`, "ITEM_UNAVAILABLE");
    }

    return {
      menuItemId: menuItem.id,
      itemName: menuItem.name,
      unitPriceMinor: menuItem.priceMinor,
      quantity: line.quantity,
      lineTotalMinor: menuItem.priceMinor * line.quantity,
      notes: line.notes ?? null,
    };
  });

  const subtotalMinor = lines.reduce((sum, line) => sum + line.lineTotalMinor, 0);
  return { lines, subtotalMinor };
}

export async function createOrder(slug: string, input: CreateOrderInput) {
  return withTransaction(async (client) => {
    const restaurant = await findActiveRestaurantBySlug(slug, client);
    if (!restaurant) throw notFound("Restaurant not found");

    const menuItems = await findItemsForOrder(
      restaurant.id,
      input.items.map((item) => item.menuItemId),
      client,
    );
    const { lines, subtotalMinor } = buildOrderLines(input.items, menuItems);

    let queueEntryId: string | null = null;
    if (input.queueToken) {
      const entry = await findQueueEntryByTokenHashForRestaurant(
        restaurant.id,
        hashPublicToken(input.queueToken),
        client,
      );
      if (!entry) throw badRequest("Queue token is not valid here", "INVALID_QUEUE_TOKEN");
      queueEntryId = entry.id;
    }

    const { token, tokenHash } = createPublicToken();
    const order = await insertOrder(client, {
      restaurantId: restaurant.id,
      queueEntryId,
      customerName: input.customerName,
      tokenHash,
      paymentMethod: input.paymentMethod,
      subtotalMinor,
      totalMinor: subtotalMinor,
      currency: restaurant.currency,
      customerNotes: input.customerNotes ?? null,
    });

    const items = [];
    for (const line of lines) {
      items.push(await insertOrderItem(client, order.id, line));
    }

    return { ...order, items, token };
  });
}

export async function getOrderByToken(token: string) {
  const order = await findOrderByTokenHash(hashPublicToken(token));
  if (!order) throw notFound("Order not found");

  return { ...order, items: await listOrderItems([order.id]) };
}

export async function getStaffOrders(restaurantId: string, status?: OrderStatus) {
  const orders = await listOrders(restaurantId, status ?? null);
  const items = await listOrderItems(orders.map((order) => order.id));

  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.orderId === order.id),
  }));
}

export async function getStaffOrder(restaurantId: string, id: string) {
  const order = await findOrderById(restaurantId, id);
  if (!order) throw notFound("Order not found");

  return { ...order, items: await listOrderItems([order.id]) };
}

export async function changeOrderStatus(
  restaurantId: string,
  id: string,
  status: OrderStatus,
) {
  const order = await findOrderById(restaurantId, id);
  if (!order) throw notFound("Order not found");

  assertTransition(orderTransitions, order.status, status, "order");

  const updated = await updateOrderStatus(restaurantId, id, status);
  if (!updated) throw notFound("Order not found");
  return updated;
}
