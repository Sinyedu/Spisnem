import assert from "node:assert/strict";
import { after, before, describe, test } from "node:test";
import type { FastifyInstance } from "fastify";
import { bearer, joinQueue, staffToken, startTestApp } from "./api-helpers.js";

let app: FastifyInstance;
let stop: () => Promise<void>;
let token: string;

before(async () => {
  const started = await startTestApp();
  app = started.app;
  stop = started.stop;
  token = await staffToken(app, started.env.SEED_ADMIN_EMAIL, started.env.SEED_ADMIN_PASSWORD);
});

after(async () => {
  await stop();
});

describe("staff basics", () => {
  test("staff can log in and read and update their restaurant", async () => {
    const current = await app.inject({ method: "GET", url: "/api/staff/restaurants/me", headers: bearer(token) });
    const restaurant = current.json().data;
    const updated = await app.inject({
      method: "PATCH", url: "/api/staff/restaurants/me", headers: bearer(token), payload: { name: restaurant.name },
    });
    assert.equal(current.statusCode, 200);
    assert.equal(updated.json().data.id, restaurant.id);
    assert.equal(restaurant.queueState, "open");
  });

  test("public summary and map include live wait figures", async () => {
    const summary = (await app.inject({ method: "GET", url: "/api/public/summary" })).json().data;
    assert.ok(summary.restaurants >= 11);
    const map = await app.inject({
      method: "GET", url: "/api/public/restaurants/map?west=12.4&south=55.6&east=12.7&north=55.75&limit=50",
    });
    const properties = map.json().features[0].properties;
    assert.equal(typeof properties.estimatedWaitMinutes, "number");
    assert.equal(typeof properties.partiesWaiting, "number");
  });
});

describe("a guest's visit", () => {
  test("estimate, join, call, on my way, seat at a table, and accuracy", async () => {
    const estimate = await app.inject({ method: "GET", url: "/api/public/restaurants/spisnem/queue/estimate?partySize=2" });
    assert.equal(estimate.json().data.queueState, "open");

    const guest = await joinQueue(app, "Julia", 2);
    assert.ok(guest.token);
    assert.equal(typeof guest.quotedWaitMinutes, "number");

    const table = await app.inject({ method: "POST", url: "/api/staff/tables", headers: bearer(token), payload: { label: "T1", seats: 2 } });
    assert.equal(table.statusCode, 201);

    const called = await app.inject({ method: "POST", url: `/api/staff/queue/${guest.id}/call`, headers: bearer(token) });
    assert.equal(called.json().data.status, "notified");
    assert.ok(called.json().data.graceUntil);

    const onMyWay = await app.inject({ method: "POST", url: `/api/public/queue/${guest.token}/on-my-way` });
    assert.ok(onMyWay.json().data.onMyWayAt);

    const seated = await app.inject({
      method: "POST", url: `/api/staff/queue/${guest.id}/seat`, headers: bearer(token), payload: { tableId: table.json().data.id },
    });
    assert.equal(seated.json().data.status, "seated");

    const tables = (await app.inject({ method: "GET", url: "/api/staff/tables", headers: bearer(token) })).json().data;
    assert.equal(tables[0].status, "seated");

    const insights = (await app.inject({ method: "GET", url: "/api/staff/insights", headers: bearer(token) })).json().data;
    assert.equal(insights.seated, 1);
    assert.equal(insights.accuracy.samples, 1);
  });

  test("seating someone twice is refused", async () => {
    const guest = await joinQueue(app, "Twice");
    await app.inject({ method: "POST", url: `/api/staff/queue/${guest.id}/seat`, headers: bearer(token), payload: {} });
    const again = await app.inject({ method: "POST", url: `/api/staff/queue/${guest.id}/seat`, headers: bearer(token), payload: {} });
    assert.equal(again.statusCode, 409);
  });

  test("running late moves a guest back, once", async () => {
    const first = await joinQueue(app, "Late");
    await joinQueue(app, "On time");
    const late = await app.inject({ method: "POST", url: `/api/public/queue/${first.token}/late`, payload: { minutes: 10 } });
    assert.ok(late.json().data.position > first.position);
    assert.equal(late.json().data.canReportLate, false);
    const twice = await app.inject({ method: "POST", url: `/api/public/queue/${first.token}/late`, payload: { minutes: 5 } });
    assert.equal(twice.statusCode, 400);
  });

  test("a paused queue turns app guests away but still takes walk-ins", async () => {
    await app.inject({ method: "PATCH", url: "/api/staff/queue/settings", headers: bearer(token), payload: { queueState: "paused" } });
    const join = await app.inject({ method: "POST", url: "/api/public/restaurants/spisnem/queue", payload: { guestName: "X", partySize: 2 } });
    assert.equal(join.json().error.code, "QUEUE_PAUSED");
    const walkIn = await app.inject({ method: "POST", url: "/api/staff/queue", headers: bearer(token), payload: { partySize: 3 } });
    assert.equal(walkIn.json().data.source, "walk_in");
    await app.inject({ method: "PATCH", url: "/api/staff/queue/settings", headers: bearer(token), payload: { queueState: "open" } });
  });
});

describe("guests and live updates", () => {
  test("favourites need a signed-in guest", async () => {
    const response = await app.inject({ method: "GET", url: "/api/customer/favourites" });
    assert.equal(response.statusCode, 401);
  });

  test("a ticket stream sends the entry straight away", async () => {
    const guest = await joinQueue(app, "Streamer");
    const address = await app.listen({ port: 0, host: "127.0.0.1" });
    const controller = new AbortController();
    const response = await fetch(`${address}/api/public/queue/${guest.token}/stream`, { signal: controller.signal });
    const reader = response.body!.getReader();
    const first = new TextDecoder().decode((await reader.read()).value);
    controller.abort();
    assert.equal(response.headers.get("content-type"), "text/event-stream");
    assert.match(first, /^event: entry/);
  });
});
