import type { StaffToken } from "../types/index.js";
import { forbidden } from "./errors.js";

// For routes where only some changes need the owner role, decided after reading the body.
export function assertOwner(user: StaffToken) {
  if (user.role !== "owner") throw forbidden("Owner role required");
}
