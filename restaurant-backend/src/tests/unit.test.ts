import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { quoteAccuracy, summarizeInsights } from "../modules/insights/insights.calculator.js";
import { canChangeQueueStatus } from "../modules/queue/queue-transitions.js";
import { estimateLine, estimateNewParty, minutesPerParty } from "../modules/queue/wait-estimator.js";
import type { QueueEntryDoc, WaitSnapshot } from "../types/index.js";

const NOW = new Date("2026-10-01T18:00:00Z");
const minutesAgo = (minutes: number) => new Date(NOW.getTime() - minutes * 60_000);

function snapshot(overrides: Partial<WaitSnapshot> = {}): WaitSnapshot {
  return {
    now: NOW, queueState: "open", fallbackMinutesPerParty: 10, queue: [],
    seatedInWindow: 0, tables: [], tableTurnMinutes: null, ...overrides,
  };
}

const party = (id: string, partySize = 2, status: "waiting" | "notified" = "waiting") =>
  ({ id, partySize, status, quoteOverrideMinutes: null });

test("queue status transitions", () => {
  assert.equal(canChangeQueueStatus("waiting", "notified"), true);
  assert.equal(canChangeQueueStatus("notified", "seated"), true);
  assert.equal(canChangeQueueStatus("waiting", "no_show"), false);
  assert.equal(canChangeQueueStatus("seated", "waiting"), false);
});

describe("wait estimator", () => {
  test("uses the restaurant's own number when there is no history", () => {
    assert.deepEqual(minutesPerParty(snapshot()), { minutes: 10, basis: "restaurant_default" });
    assert.deepEqual(estimateLine(snapshot({ queue: [party("a"), party("b")] })).minutes, [0, 10]);
  });

  test("learns the pace from recent seatings, trusting it more as samples grow", () => {
    // 12 seatings in the last hour = 5 minutes per party, fully trusted.
    assert.equal(minutesPerParty(snapshot({ seatedInWindow: 12 })).minutes, 5);
    // 3 seatings = 20 min observed, half trusted: 0.5 × 20 + 0.5 × 10.
    assert.equal(minutesPerParty(snapshot({ seatedInWindow: 3 })).minutes, 15);
  });

  test("a called guest holds the line up for half as long", () => {
    const line = estimateLine(snapshot({ queue: [party("a", 2, "notified"), party("b")] }));
    assert.deepEqual(line.minutes, [0, 5]);
  });

  test("with tables, guests wait for the first table big enough for them", () => {
    const tables = [
      { seats: 2, status: "free" as const, seatedAt: null },
      { seats: 4, status: "seated" as const, seatedAt: minutesAgo(30) },
    ];
    const line = estimateLine(snapshot({ tables, tableTurnMinutes: 40, queue: [party("couple"), party("four", 4)] }));
    assert.equal(line.basis, "tables");
    // The couple takes the free two-top now; the four waits for the four-top (40 − 30 min).
    assert.deepEqual(line.minutes, [0, 10]);
  });

  test("a hand-typed wait wins over the estimate", () => {
    const queue = [{ ...party("a"), quoteOverrideMinutes: 25 }];
    assert.deepEqual(estimateLine(snapshot({ queue })).minutes, [25]);
  });

  test("quotes a newcomer at the back of the line", () => {
    const estimate = estimateNewParty(snapshot({ queue: [party("a"), party("b")] }), 2);
    assert.deepEqual(estimate, { minutes: 20, partiesAhead: 2, basis: "restaurant_default" });
  });
});

describe("insights", () => {
  const entry = (quoted: number | null, waited: number | null, status: QueueEntryDoc["status"] = "seated") =>
    ({
      status, partySize: 2, quotedWaitMinutes: quoted, joinedAt: minutesAgo(60),
      notifiedAt: waited === null ? null : new Date(minutesAgo(60).getTime() + waited * 60_000), seatedAt: null,
    }) as QueueEntryDoc;

  test("quote accuracy compares the promise with when the guest was called", () => {
    const accuracy = quoteAccuracy([entry(10, 12), entry(10, 25), entry(null, 5), entry(10, null)]);
    assert.deepEqual(accuracy, { samples: 2, meanAbsoluteErrorMinutes: 9, withinFiveMinutesShare: 0.5 });
  });

  test("summary counts outcomes", () => {
    const summary = summarizeInsights([entry(10, 10), entry(10, null, "cancelled"), entry(5, 6, "no_show")], {
      from: minutesAgo(120), to: NOW,
    });
    assert.equal(summary.parties, 3);
    assert.equal(summary.seated, 1);
    assert.equal(summary.leftQueue, 1);
    assert.equal(summary.noShows, 1);
    assert.equal(summary.guestsSeated, 2);
  });
});
