import { restaurantTables } from "../../database/collections.js";
import type { TableDoc, TableStatus } from "../../types/index.js";

export function listTablesFor(restaurantIds: string[]) {
  return restaurantTables.find({ restaurantId: { $in: restaurantIds } }).toArray();
}

export function listTables(restaurantId: string) {
  return restaurantTables.find({ restaurantId }).sort({ sortOrder: 1, label: 1 }).toArray();
}

export function findTable(restaurantId: string, id: string) {
  return restaurantTables.findOne({ _id: id, restaurantId });
}

export async function insertTable(table: TableDoc) {
  await restaurantTables.insertOne(table);
  return table;
}

export function updateTable(restaurantId: string, id: string, changes: Partial<TableDoc>) {
  return restaurantTables.findOneAndUpdate(
    { _id: id, restaurantId },
    { $set: { ...changes, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

// Seats a party only if the table is still free or about to be, in one atomic step.
export function occupyTable(restaurantId: string, id: string, entryId: string, partySize: number) {
  const available: TableStatus[] = ["free", "soon"];
  return restaurantTables.findOneAndUpdate(
    { _id: id, restaurantId, status: { $in: available } },
    { $set: { status: "seated", seatedAt: new Date(), entryId, partySize, updatedAt: new Date() } },
    { returnDocument: "after" },
  );
}

export async function deleteTable(restaurantId: string, id: string) {
  const result = await restaurantTables.deleteOne({ _id: id, restaurantId });
  return result.deletedCount === 1;
}
