import { isoOrNull } from "../../shared/time.js";
import type { QueueEntry, QueueEntryDoc } from "../../types/index.js";

export function toQueueEntry(doc: QueueEntryDoc): QueueEntry {
  return {
    id: doc._id,
    restaurantId: doc.restaurantId,
    guestName: doc.guestName,
    phone: doc.phone,
    partySize: doc.partySize,
    notes: doc.notes,
    status: doc.status,
    source: doc.source,
    quotedWaitMinutes: doc.quotedWaitMinutes,
    quoteOverrideMinutes: doc.quoteOverrideMinutes,
    tableId: doc.tableId,
    lateCount: doc.lateCount,
    joinedAt: doc.joinedAt.toISOString(),
    notifiedAt: isoOrNull(doc.notifiedAt),
    onMyWayAt: isoOrNull(doc.onMyWayAt),
    graceUntil: isoOrNull(doc.graceUntil),
    seatedAt: isoOrNull(doc.seatedAt),
    cancelledAt: isoOrNull(doc.cancelledAt),
    noShowAt: isoOrNull(doc.noShowAt),
  };
}
