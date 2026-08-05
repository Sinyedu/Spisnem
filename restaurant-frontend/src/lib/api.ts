import { apiGet, apiPost } from "./apiClient";
import type {
  JoinQueueInput,
  JoinQueueResponse,
  Menu,
  PublicQueueEntry,
  Restaurant,
  RestaurantDetail,
} from "../types/api";

export function getRestaurants(search?: string) {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return apiGet<Restaurant[]>(`/public/restaurants${query}`);
}

export function getRestaurant(slug: string) {
  return apiGet<RestaurantDetail>(`/public/restaurants/${slug}`);
}

export function getMenu(slug: string) {
  return apiGet<Menu>(`/public/restaurants/${slug}/menu`);
}

export function joinQueue(slug: string, input: JoinQueueInput) {
  return apiPost<JoinQueueResponse>(`/public/restaurants/${slug}/queue`, input);
}

export function getQueueEntry(token: string) {
  return apiGet<PublicQueueEntry>(`/public/queue/${token}`);
}

export function cancelQueue(token: string) {
  return apiPost<PublicQueueEntry>(`/public/queue/${token}/cancel`);
}
