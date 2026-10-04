import { API_URL } from "../config/env";
import type { AuthErrorBody, SocialAuthResponse, SocialProvider } from "../types/auth";

const AUTH_URL = `${API_URL}/customer/auth`;

export class AuthError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthError";
    this.status = status;
  }
}

async function authRequest<T>(path: string, body: object): Promise<T> {
  const response = await fetch(`${AUTH_URL}${path}`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const result = (await response.json().catch(() => ({}))) as AuthErrorBody & T;
  if (!response.ok) {
    const nestedMessage = typeof result.error === "object" ? result.error.message : result.error;
    throw new AuthError(result.message ?? nestedMessage ?? "Authentication failed", response.status);
  }

  return result;
}

export async function signInWithEmail(email: string, password: string) {
  return authRequest("/sign-in/email", { email, password });
}

export async function signUpWithEmail(name: string, email: string, password: string) {
  return authRequest("/sign-up/email", { name, email, password });
}

export async function signInWithSocial(provider: SocialProvider) {
  const callbackURL = `${window.location.origin}/map`;
  const result = await authRequest<SocialAuthResponse>("/sign-in/social", {
    provider,
    callbackURL,
  });

  if (!result.url) throw new AuthError("The sign-in provider is not available", 400);
  window.location.assign(result.url);
  return new Promise<never>(() => undefined);
}
