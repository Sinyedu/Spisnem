import { API_URL } from "../config/env";
import type { Summary } from "../types/api";

// Landing-screen counts. See backend GET /api/public/summary.
export async function getSummary(): Promise<Summary> {
  const response = await fetch(`${API_URL}/public/summary`);
  if (!response.ok) throw new Error(`summary request failed (${response.status})`);
  const body = (await response.json()) as { data: Summary };
  return body.data;
}
