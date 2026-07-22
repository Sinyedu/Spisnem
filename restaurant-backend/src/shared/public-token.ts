import { createHash, randomBytes } from "node:crypto";

export function createPublicToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashPublicToken(token) };
}

export function hashPublicToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
