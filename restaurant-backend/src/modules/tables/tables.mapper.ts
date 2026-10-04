import { isoOrNull } from "../../shared/time.js";
import type { RestaurantTable, TableDoc } from "../../types/index.js";

export function toTable(doc: TableDoc): RestaurantTable {
  return {
    id: doc._id,
    label: doc.label,
    seats: doc.seats,
    status: doc.status,
    seatedAt: isoOrNull(doc.seatedAt),
    entryId: doc.entryId,
    partySize: doc.partySize,
    sortOrder: doc.sortOrder,
  };
}
