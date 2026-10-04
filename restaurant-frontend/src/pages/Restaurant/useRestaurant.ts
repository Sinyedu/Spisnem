import { useResource } from "../../hooks/useResource";
import { getRestaurant } from "../../lib/restaurants";

/** Loads one restaurant by slug, including its live wait. An empty slug loads nothing. */
export function useRestaurant(slug: string) {
  const { data, failed } = useResource(slug && `restaurant:${slug}`, (signal) => getRestaurant(slug, signal));
  return { restaurant: data, failed };
}
