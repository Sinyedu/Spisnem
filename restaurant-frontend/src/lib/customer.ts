import { API_URL } from "../config/env";
import type { CustomerUser, CustomerVisit, FavouriteRestaurant } from "../types/api";
import { apiRequest } from "./http";

type SessionBody = { user?: CustomerUser } | null;

/** The signed-in guest, or null. Better Auth answers get-session with null when signed out. */
export async function getCustomerSession(signal?: AbortSignal): Promise<CustomerUser | null> {
  const response = await fetch(`${API_URL}/customer/auth/get-session`, { credentials: "include", signal });
  if (!response.ok) return null;
  const body = (await response.json().catch(() => null)) as SessionBody;
  return body?.user ?? null;
}

export async function signOutCustomer() {
  await fetch(`${API_URL}/customer/auth/sign-out`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
}

export function getFavourites(signal?: AbortSignal) {
  return apiRequest<FavouriteRestaurant[]>("/customer/favourites", { signal, withSession: true });
}

export function addFavourite(restaurantId: string) {
  return apiRequest<void>(`/customer/favourites/${restaurantId}`, { method: "PUT", withSession: true });
}

export function removeFavourite(restaurantId: string) {
  return apiRequest<void>(`/customer/favourites/${restaurantId}`, { method: "DELETE", withSession: true });
}

export function getVisits(signal?: AbortSignal) {
  return apiRequest<CustomerVisit[]>("/customer/visits", { signal, withSession: true });
}
