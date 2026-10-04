import type { Menu } from "../types/api";
import { apiRequest } from "./http";

// A restaurant's public menu: active categories and available dishes only.
export function getPublicMenu(slug: string, signal?: AbortSignal) {
  return apiRequest<Menu>(`/public/restaurants/${slug}/menu`, { signal });
}

export function formatPrice(priceMinor: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(priceMinor / 100);
}
