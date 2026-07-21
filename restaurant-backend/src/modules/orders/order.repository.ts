import { pool } from "../../database/pool.js";
import type { Db, NewOrder, Order, OrderItem, OrderLine, OrderStatus } from "../../types/index.js";

const orderColumns = `
  id,
  restaurant_id AS "restaurantId",
  queue_entry_id AS "queueEntryId",
  customer_name AS "customerName",
  status,
  payment_method AS "paymentMethod",
  subtotal_minor AS "subtotalMinor",
  total_minor AS "totalMinor",
  currency,
  customer_notes AS "customerNotes",
  submitted_at AS "submittedAt",
  confirmed_at AS "confirmedAt",
  preparing_at AS "preparingAt",
  ready_at AS "readyAt",
  completed_at AS "completedAt",
  cancelled_at AS "cancelledAt"
`;

const orderItemColumns = `
  id,
  order_id AS "orderId",
  menu_item_id AS "menuItemId",
  item_name AS "itemName",
  unit_price_minor AS "unitPriceMinor",
  quantity,
  line_total_minor AS "lineTotalMinor",
  notes
`;

const timestampColumnByStatus: Record<OrderStatus, string | null> = {
  submitted: null,
  confirmed: "confirmed_at",
  preparing: "preparing_at",
  ready: "ready_at",
  completed: "completed_at",
  cancelled: "cancelled_at",
};

export async function insertOrder(db: Db, order: NewOrder) {
  const result = await db.query<Order>(
    `INSERT INTO orders (restaurant_id, queue_entry_id, customer_name, public_token_hash,
       payment_method, subtotal_minor, total_minor, currency, customer_notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING ${orderColumns}`,
    [
      order.restaurantId,
      order.queueEntryId,
      order.customerName,
      order.tokenHash,
      order.paymentMethod,
      order.subtotalMinor,
      order.totalMinor,
      order.currency,
      order.customerNotes,
    ],
  );
  return result.rows[0]!;
}

export async function insertOrderItem(db: Db, orderId: string, line: OrderLine) {
  const result = await db.query<OrderItem>(
    `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price_minor,
       quantity, line_total_minor, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING ${orderItemColumns}`,
    [
      orderId,
      line.menuItemId,
      line.itemName,
      line.unitPriceMinor,
      line.quantity,
      line.lineTotalMinor,
      line.notes,
    ],
  );
  return result.rows[0]!;
}

export async function findOrderByTokenHash(tokenHash: string) {
  const result = await pool.query<Order>(
    `SELECT ${orderColumns} FROM orders WHERE public_token_hash = $1`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function findOrderById(restaurantId: string, id: string) {
  const result = await pool.query<Order>(
    `SELECT ${orderColumns} FROM orders WHERE restaurant_id = $1 AND id = $2`,
    [restaurantId, id],
  );
  return result.rows[0] ?? null;
}

export async function listOrders(restaurantId: string, status: OrderStatus | null) {
  const result = await pool.query<Order>(
    `SELECT ${orderColumns}
     FROM orders
     WHERE restaurant_id = $1 AND ($2::text IS NULL OR status = $2)
     ORDER BY submitted_at DESC
     LIMIT 100`,
    [restaurantId, status],
  );
  return result.rows;
}

export async function listOrderItems(orderIds: string[]) {
  if (orderIds.length === 0) return [];

  const result = await pool.query<OrderItem>(
    `SELECT ${orderItemColumns}
     FROM order_items
     WHERE order_id = ANY($1::uuid[])
     ORDER BY created_at`,
    [orderIds],
  );
  return result.rows;
}

export async function updateOrderStatus(
  restaurantId: string,
  id: string,
  status: OrderStatus,
) {
  const timestampColumn = timestampColumnByStatus[status];
  const timestampSet = timestampColumn ? `, ${timestampColumn} = now()` : "";

  const result = await pool.query<Order>(
    `UPDATE orders
     SET status = $3, updated_at = now()${timestampSet}
     WHERE restaurant_id = $1 AND id = $2
     RETURNING ${orderColumns}`,
    [restaurantId, id, status],
  );
  return result.rows[0] ?? null;
}
