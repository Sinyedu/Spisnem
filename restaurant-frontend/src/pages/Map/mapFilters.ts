import type { MapRestaurant } from "../../types/api";
import type { MapFilterId } from "../../types/map";
import { estimateWait } from "../../lib/wait";

// "Short wait" means this many minutes or less.
export const SHORT_WAIT_MINUTES = 10;
// Price level 1 ("$") counts as budget.
export const BUDGET_PRICE_LEVEL = 1;

type MapFilter = {
  id: MapFilterId;
  test: (restaurant: MapRestaurant) => boolean;
};

function hasShortWait(restaurant: MapRestaurant) {
  const wait = estimateWait(restaurant);
  return wait.open && wait.minutes <= SHORT_WAIT_MINUTES;
}

export const MAP_FILTERS: readonly MapFilter[] = [
  { id: "all", test: () => true },
  { id: "queueOpen", test: (restaurant) => restaurant.queueEnabled },
  { id: "shortWait", test: hasShortWait },
  { id: "budget", test: (restaurant) => restaurant.priceLevel === BUDGET_PRICE_LEVEL },
];

export function filterById(id: MapFilterId) {
  return MAP_FILTERS.find((filter) => filter.id === id) ?? MAP_FILTERS[0];
}
