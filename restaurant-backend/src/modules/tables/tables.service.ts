import { MongoServerError } from "mongodb";
import { conflict, notFound } from "../../shared/errors.js";
import { newId } from "../../shared/ids.js";
import { definedFields } from "../../shared/objects.js";
import { publishChange } from "../../shared/live-bus.js";
import { minutesBetween } from "../../shared/time.js";
import type { CreateTableInput, TableDoc, UpdateTableInput } from "../../types/index.js";
import { recordEvent } from "../queue/queue-events.repository.js";
import { toTable } from "./tables.mapper.js";
import { deleteTable, findTable, insertTable, listTables, updateTable } from "./tables.repository.js";

const DUPLICATE_KEY = 11000;

function isDuplicateLabel(error: unknown) {
  return error instanceof MongoServerError && error.code === DUPLICATE_KEY;
}

export async function getTables(restaurantId: string) {
  return (await listTables(restaurantId)).map(toTable);
}

export async function createTable(restaurantId: string, input: CreateTableInput) {
  const now = new Date();
  const table: TableDoc = {
    _id: newId(), restaurantId, label: input.label, seats: input.seats, status: "free",
    seatedAt: null, entryId: null, partySize: null, sortOrder: input.sortOrder, createdAt: now, updatedAt: now,
  };
  try {
    await insertTable(table);
  } catch (error) {
    if (isDuplicateLabel(error)) throw conflict(`Table ${input.label} already exists`, "TABLE_EXISTS");
    throw error;
  }
  publishChange(restaurantId, { kind: "tables", id: table._id });
  return toTable(table);
}

// Leaving "seated" is when we learn how long the table was in use.
async function recordTableFreed(table: TableDoc, staffUserId: string) {
  if (table.status !== "seated" || !table.seatedAt) return;
  await recordEvent({
    restaurantId: table.restaurantId, entryId: table.entryId, tableId: table._id, type: "table_freed",
    actor: "staff", staffUserId,
    data: { minutes: minutesBetween(table.seatedAt, new Date()), seats: table.seats, partySize: table.partySize },
  });
}

function statusChanges(table: TableDoc, status: UpdateTableInput["status"]): Partial<TableDoc> {
  if (!status || status === table.status) return {};
  if (status === "seated") return { status, seatedAt: new Date() };
  if (status === "soon") return { status };
  return { status, seatedAt: null, entryId: null, partySize: null };
}

export async function editTable(restaurantId: string, id: string, input: UpdateTableInput, staffUserId: string) {
  const table = await findTable(restaurantId, id);
  if (!table) throw notFound("Table not found");
  const { status, ...fields } = input;
  if (status === "free" || status === "blocked") await recordTableFreed(table, staffUserId);
  const updated = await updateTable(restaurantId, id, { ...definedFields(fields), ...statusChanges(table, status) });
  if (!updated) throw notFound("Table not found");
  publishChange(restaurantId, { kind: "tables", id });
  return toTable(updated);
}

export async function removeTable(restaurantId: string, id: string) {
  if (!(await deleteTable(restaurantId, id))) throw notFound("Table not found");
  publishChange(restaurantId, { kind: "tables", id });
}
