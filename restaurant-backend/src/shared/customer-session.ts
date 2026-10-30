import type { FastifyRequest } from "fastify";
import { customerAuth } from "../modules/customer-auth/customer-auth.config.js";
import { unauthorized } from "./errors.js";
import { toWebHeaders } from "./web-request.js";

/** The signed-in guest's id from their Better Auth session cookie, or null when signed out. */
export async function getCustomerUserId(request: FastifyRequest) {
  const session = await customerAuth.api.getSession({ headers: toWebHeaders(request) });
  return session?.user.id ?? null;
}

export async function requireCustomerUserId(request: FastifyRequest) {
  const userId = await getCustomerUserId(request);
  if (!userId) throw unauthorized("Sign in to use this");
  return userId;
}
