import { buildApp } from "./app.js";
import { env } from "./config/env.js";

const app = await buildApp();

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    // app.close() runs the onClose hook, which closes the MongoDB connection.
    app.close().then(() => process.exit(0));
  });
}

try {
  await app.listen({ port: env.PORT, host: env.HOST });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
