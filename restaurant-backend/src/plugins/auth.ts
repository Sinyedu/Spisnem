import jwt from "@fastify/jwt";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/env.js";
import { forbidden, unauthorized } from "../shared/errors.js";
import type { StaffToken } from "../types/index.js";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: StaffToken;
    user: StaffToken;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOwner: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export async function registerAuth(app: FastifyInstance) {
  await app.register(jwt, {
    secret: env.JWT_SECRET,
    sign: { expiresIn: "12h" },
  });

  app.decorate("authenticate", async (request: FastifyRequest) => {
    try {
      await request.jwtVerify();
    } catch {
      throw unauthorized("Invalid or missing token");
    }
  });

  // Runs after authenticate, so request.user is already set.
  app.decorate("requireOwner", async (request: FastifyRequest) => {
    if (request.user.role !== "owner") {
      throw forbidden("Owner role required");
    }
  });
}
