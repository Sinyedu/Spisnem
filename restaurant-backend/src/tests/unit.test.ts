import assert from "node:assert/strict";
import { test } from "node:test";
import { buildOrderLines, canChangeOrderStatus } from "../modules/orders/order.service.js";
import { canChangeQueueStatus } from "../modules/queue/queue.service.js";
import { AppError } from "../shared/errors.js";
import type { MenuItem } from "../types/index.js";

const pizza: MenuItem = {
  id: "11111111-1111-1111-1111-111111111111",
  categoryId: null,
  name: "Margherita",
  description: null,
  priceMinor: 8900,
  currency: "DKK",
  imageUrl: null,
  isAvailable: true,
  isFeatured: false,
  sortOrder: 0,
};

test("order totals use database prices, not client input", () => {
  const { lines, subtotalMinor } = buildOrderLines(
    [{ menuItemId: pizza.id, quantity: 2 }],
    [pizza],
  );

  assert.equal(lines[0]?.unitPriceMinor, 8900);
  assert.equal(lines[0]?.lineTotalMinor, 17800);
  assert.equal(subtotalMinor, 17800);
});

test("unavailable menu items are rejected", () => {
  assert.throws(
    () => buildOrderLines([{ menuItemId: pizza.id, quantity: 1 }], [{ ...pizza, isAvailable: false }]),
    (error: unknown) => error instanceof AppError && error.code === "ITEM_UNAVAILABLE",
  );
});

test("items from another restaurant are rejected", () => {
  assert.throws(
    () => buildOrderLines([{ menuItemId: pizza.id, quantity: 1 }], []),
    (error: unknown) => error instanceof AppError && error.code === "INVALID_MENU_ITEM",
  );
});

test("queue status transitions", () => {
  assert.equal(canChangeQueueStatus("waiting", "notified"), true);
  assert.equal(canChangeQueueStatus("notified", "seated"), true);
  assert.equal(canChangeQueueStatus("waiting", "no_show"), false);
  assert.equal(canChangeQueueStatus("seated", "waiting"), false);
});

test("order status transitions", () => {
  assert.equal(canChangeOrderStatus("submitted", "confirmed"), true);
  assert.equal(canChangeOrderStatus("ready", "completed"), true);
  assert.equal(canChangeOrderStatus("submitted", "ready"), false);
  assert.equal(canChangeOrderStatus("completed", "cancelled"), false);
});
