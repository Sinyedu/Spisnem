// Makes user text safe to drop into a regular expression (used for search).
export function escapeRegex(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
