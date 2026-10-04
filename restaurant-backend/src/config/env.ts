import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  HOST: z.string().default("0.0.0.0"),
  PORT: z.coerce.number().int().positive().default(3000),
  // Same defaults as the dashboard backend, so both talk to one local database.
  MONGODB_URI: z.string().min(1).default("mongodb://127.0.0.1:27017"),
  MONGODB_DB_NAME: z.string().min(1).default("spisnem"),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:5173"),
  PUBLIC_APP_URL: z.string().default("http://localhost:5173"),
  // Where this API is reachable from outside. Better Auth builds its OAuth callback
  // URLs from it, so it has to match what Google and Apple are configured with.
  PUBLIC_API_URL: z.string().default("http://localhost:3000"),
  // Falls back to JWT_SECRET, so an existing .env keeps working untouched.
  BETTER_AUTH_SECRET: z.string().min(16).optional(),
  // A social provider is only switched on when both halves of its credential are
  // present, so local development runs fine with none of them set.
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  APPLE_CLIENT_ID: z.string().optional(),
  APPLE_CLIENT_SECRET: z.string().optional(),
  APPLE_APP_BUNDLE_IDENTIFIER: z.string().optional(),
  SEED_ADMIN_EMAIL: z.email().default("admin@spisnem.dk"),
  SEED_ADMIN_PASSWORD: z.string().min(8).default("development-password"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment configuration:");
  for (const issue of parsed.error.issues) {
    console.error(`  ${issue.path.join(".")}: ${issue.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
