import assert from "node:assert/strict";
import { test } from "node:test";
import { canChangeQueueStatus } from "../modules/queue/queue.service.js";

test("queue status transitions", () => {
  assert.equal(canChangeQueueStatus("waiting", "notified"), true);
  assert.equal(canChangeQueueStatus("notified", "seated"), true);
  assert.equal(canChangeQueueStatus("waiting", "no_show"), false);
  assert.equal(canChangeQueueStatus("seated", "waiting"), false);
});
