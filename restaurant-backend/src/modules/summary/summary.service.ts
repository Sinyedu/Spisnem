import { getSummaryCounts } from "./summary.repository.js";

export function getPublicSummary() {
  return getSummaryCounts();
}
