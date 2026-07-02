import { buildApp } from "./app";
import { env } from "./config/env";

const app = buildApp();

try {
  await app.listen({
    port: env.PORT,
    host: "0.0.0.0",
  });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
