import { betterAuth, type BetterAuthOptions } from "better-auth";
import { env } from "../../config/env.js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { db } from "../../database/mongo.js";

/**
 * Customer accounts. Staff keep their own bcrypt and JWT login under /api/auth:
 * different people, different tables, deliberately not merged. Better Auth owns
 * "user", "session", "account" and "verification"; the staff `users` table is
 * left exactly as it was.
 */
export const CUSTOMER_AUTH_BASE_PATH = "/api/customer/auth";

// A provider only exists once both halves of its credential are configured, so a
// developer with none of them still gets a working email and password login.
function configuredProviders(): NonNullable<BetterAuthOptions["socialProviders"]> {
  const providers: NonNullable<BetterAuthOptions["socialProviders"]> = {};

  if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
    providers.google = {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    };
  }

  if (env.APPLE_CLIENT_ID && env.APPLE_CLIENT_SECRET) {
    providers.apple = {
      clientId: env.APPLE_CLIENT_ID,
      // Apple's "client secret" is a JWT you sign yourself and it expires after at
      // most six months, so this value has to be regenerated on a schedule.
      clientSecret: env.APPLE_CLIENT_SECRET,
      appBundleIdentifier: env.APPLE_APP_BUNDLE_IDENTIFIER,
    };
  }

  return providers;
}

// Exported on its own so the migration generator and the running app read the
// exact same configuration. See scripts note in the backend README.
export const customerAuthOptions = {
  database: mongodbAdapter(db),
  basePath: CUSTOMER_AUTH_BASE_PATH,
  baseURL: env.PUBLIC_API_URL,
  secret: env.BETTER_AUTH_SECRET ?? env.JWT_SECRET,
  trustedOrigins: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  emailAndPassword: { enabled: true },
  socialProviders: configuredProviders(),
} satisfies BetterAuthOptions;

export const customerAuth = betterAuth(customerAuthOptions);
