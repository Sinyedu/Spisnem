import type { FastifyInstance } from "fastify";
import { sendWebResponse, toWebRequest } from "../../shared/web-request.js";
import { customerAuth } from "./customer-auth.config.js";

export async function customerAuthRoutes(app: FastifyInstance) {
  // Apple returns its OAuth callback as a form post. Fastify has no parser for that
  // content type by default and would reject the request before Better Auth ever
  // sees it, so keep the raw string and forward it untouched. Registering this
  // inside the plugin keeps it scoped to these routes.
  app.addContentTypeParser(
    "application/x-www-form-urlencoded",
    { parseAs: "string" },
    (_request, body, done) => done(null, body),
  );

  // Better Auth serves its own sub-routes (sign-in, sign-up, callbacks, sign-out),
  // so everything under the base path goes straight to its handler.
  app.route({
    method: ["GET", "POST"],
    url: "/*",
    async handler(request, reply) {
      const response = await customerAuth.handler(toWebRequest(request));
      return sendWebResponse(reply, response);
    },
  });
}
