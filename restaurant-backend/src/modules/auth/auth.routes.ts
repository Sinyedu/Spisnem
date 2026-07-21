import type { FastifyInstance } from "fastify";
import { loginSchema } from "./auth.schemas.js";
import { verifyLogin } from "./auth.service.js";

export async function authRoutes(app: FastifyInstance) {
  app.post("/login", async (request) => {
    const { email, password } = loginSchema.parse(request.body);
    const { token, profile } = await verifyLogin(email, password);

    return {
      data: {
        accessToken: app.jwt.sign(token),
        user: profile,
      },
    };
  });

  app.get("/me", { onRequest: [app.authenticate] }, async (request) => {
    return { data: request.user };
  });
}
