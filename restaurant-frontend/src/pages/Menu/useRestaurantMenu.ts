import { useResource } from "../../hooks/useResource";
import { getPublicMenu } from "../../lib/menu";
import { useRestaurant } from "../Restaurant/useRestaurant";

/** The restaurant (for its header and live wait) and its public menu. */
export function useRestaurantMenu(slug: string) {
  const { restaurant, failed: restaurantFailed } = useRestaurant(slug);
  const menu = useResource(slug && `menu:${slug}`, (signal) => getPublicMenu(slug, signal));
  return { restaurant, menu: menu.data, failed: restaurantFailed || menu.failed };
}
