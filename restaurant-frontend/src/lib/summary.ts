const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export type Summary = {
  restaurants: number;
  openNow: number;
};

// Landing-screen counts. See backend GET /api/public/summary.
export async function getSummary(): Promise<Summary> {
  const response = await fetch(`${API_URL}/public/summary`);
  if (!response.ok) throw new Error(`summary request failed (${response.status})`);
  const body = (await response.json()) as { data: Summary };
  return body.data;
}
