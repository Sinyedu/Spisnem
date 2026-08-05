import { afterEach, describe, expect, it, vi } from "vitest";
import { apiGet } from "./apiClient";

afterEach(() => vi.unstubAllGlobals());

function stubResponse(body: string, status: number) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(body, { status })),
  );
}

describe("apiClient", () => {
  it("unwraps the { data } envelope on success", async () => {
    stubResponse(JSON.stringify({ data: { id: "1" } }), 200);
    expect(await apiGet("/x")).toEqual({ id: "1" });
  });

  it("throws ApiError carrying the backend code and message on failure", async () => {
    stubResponse(JSON.stringify({ error: { code: "NOT_FOUND", message: "nope" } }), 404);
    await expect(apiGet("/x")).rejects.toMatchObject({
      name: "ApiError",
      status: 404,
      code: "NOT_FOUND",
      message: "nope",
    });
  });

  it("rejects an ok response with an empty body instead of dereferencing null", async () => {
    stubResponse("", 200);
    await expect(apiGet("/x")).rejects.toMatchObject({ code: "BAD_RESPONSE" });
  });

  it("wraps network failures as NETWORK_ERROR", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    await expect(apiGet("/x")).rejects.toMatchObject({ code: "NETWORK_ERROR", status: 0 });
  });
});
