import type { FastifyReply, FastifyRequest } from "fastify";

/**
 * Fastify has its own request and reply objects; Better Auth speaks the web
 * standard Request and Response. These two functions are the whole bridge.
 */
export function toWebRequest(request: FastifyRequest): Request {
  const url = new URL(request.url, `${request.protocol}://${request.headers.host}`);

  return new Request(url, {
    method: request.method,
    headers: toWebHeaders(request),
    body: toWebBody(request),
  });
}

export function toWebHeaders(request: FastifyRequest): Headers {
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    // The body is re-serialised below, so the original length no longer applies.
    if (key.toLowerCase() === "content-length") continue;

    if (typeof value === "string") headers.append(key, value);
    else if (Array.isArray(value)) for (const entry of value) headers.append(key, entry);
  }

  return headers;
}

// Apple posts its OAuth callback as a form, everything else sends JSON. The form
// arrives as a raw string, kept that way by the parser in customer-auth.routes.ts.
function toWebBody(request: FastifyRequest): string | null {
  if (request.method === "GET" || request.method === "HEAD") return null;
  if (typeof request.body === "string") return request.body;
  return request.body ? JSON.stringify(request.body) : null;
}

export async function sendWebResponse(reply: FastifyReply, response: Response) {
  // Headers.forEach folds repeated Set-Cookie headers into one comma-joined string,
  // which browsers then reject. getSetCookie keeps them as separate cookies.
  const cookies = response.headers.getSetCookie();
  if (cookies.length > 0) reply.header("set-cookie", cookies);

  response.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") reply.header(key, value);
  });

  reply.status(response.status);
  return reply.send(response.body ? await response.text() : null);
}
