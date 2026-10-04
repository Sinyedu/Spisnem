import type { PublicSummary } from "../../types/index.js";
import { countRestaurants } from "../restaurants/restaurant.repository.js";

// "openNow" counts open queues as a stand-in for "open" until real opening hours exist.
export async function getSummaryCounts(): Promise<PublicSummary> {
  const { total, open } = await countRestaurants();
  return { restaurants: total, openNow: open };
}
