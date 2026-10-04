import { randomUUID } from "node:crypto";

// Documents use UUID strings as _id, the same ids the API exposed under Postgres.
export function newId() {
  return randomUUID();
}
