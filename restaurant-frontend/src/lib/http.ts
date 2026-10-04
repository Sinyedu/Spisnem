import { API_URL } from "../config/env";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string | null;

  constructor(status: number, code: string | null, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: object;
  signal?: AbortSignal;
  // Send the guest's Better Auth cookie (favourites, history, linking a visit).
  withSession?: boolean;
};

type ErrorBody = { error?: { code?: string; message?: string } };

/** One call to the backend. Unwraps `{ data }`; 204 responses resolve to undefined. */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "GET",
    signal: options.signal,
    credentials: options.withSession ? "include" : "same-origin",
    headers: options.body ? { "content-type": "application/json" } : undefined,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => ({}))) as ErrorBody & { data?: T };
  if (!response.ok) {
    throw new ApiError(response.status, body.error?.code ?? null, body.error?.message ?? `request failed (${response.status})`);
  }
  return body.data as T;
}
