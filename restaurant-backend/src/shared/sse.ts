import type { FastifyReply, FastifyRequest } from "fastify";

// Comments keep proxies from closing a quiet stream.
const HEARTBEAT_MS = 25_000;
// Changes that land close together become one message.
const DEBOUNCE_MS = 250;

export type SseStream = {
  send: (event: string, data: unknown) => void;
  // Coalesces bursts: many calls within DEBOUNCE_MS run the task once.
  schedule: (task: () => Promise<void>) => void;
  onClose: (cleanup: () => void) => void;
};

/**
 * Turns a request into a server-sent-events stream. Headers already set on the reply
 * (CORS from the cors plugin) are kept, then Fastify steps aside and we write raw.
 */
export function openSseStream(request: FastifyRequest, reply: FastifyReply): SseStream {
  const headers = {
    ...reply.getHeaders(),
    "content-type": "text/event-stream",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  };
  reply.hijack();
  reply.raw.writeHead(200, headers as Record<string, string>);

  const heartbeat = setInterval(() => reply.raw.write(": ping\n\n"), HEARTBEAT_MS);
  let timer: NodeJS.Timeout | null = null;
  const cleanups: (() => void)[] = [() => clearInterval(heartbeat), () => timer && clearTimeout(timer)];
  request.raw.on("close", () => cleanups.forEach((cleanup) => cleanup()));

  return {
    send: (event, data) => reply.raw.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
    schedule: (task) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => void task().catch((error) => request.log.error(error)), DEBOUNCE_MS);
    },
    onClose: (cleanup) => cleanups.push(cleanup),
  };
}
