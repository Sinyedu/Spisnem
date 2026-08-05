const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type BackendError = { error?: { code?: string; message?: string } };
type BackendData<T> = { data: T };

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiError(0, "NETWORK_ERROR", "Could not reach the server.");
  }

  const body = (await response.json().catch(() => null)) as
    | (BackendData<T> & BackendError)
    | null;

  if (!response.ok) {
    throw new ApiError(
      response.status,
      body?.error?.code ?? "UNKNOWN",
      body?.error?.message ?? response.statusText,
    );
  }

  // Every successful endpoint replies with a { data } envelope; guard against an
  // empty or non-JSON body (e.g. a 204 or a proxy error page) rather than deref null.
  if (!body || !("data" in body)) {
    throw new ApiError(response.status, "BAD_RESPONSE", "Unexpected response from server.");
  }

  return (body as BackendData<T>).data;
}

export const apiGet = <T>(path: string) => request<T>(path);

export const apiPost = <T>(path: string, data?: unknown) =>
  request<T>(path, {
    method: "POST",
    body: data === undefined ? undefined : JSON.stringify(data),
  });
