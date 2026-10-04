import type { MapRestaurant, RestaurantFeatureCollection } from "../../types/api";
import type { MapFilterId, MarkerFeatureCollection, MarkerProperties } from "../../types/map";
import { estimateWait, waitSortKey } from "../../lib/wait";
import { filterById } from "./mapFilters";

// Shown on a pin whose queue is closed.
const CLOSED_MARK = "–";

export const EMPTY_MARKERS: MarkerFeatureCollection = { type: "FeatureCollection", features: [] };

function matchesTerm(restaurant: MapRestaurant, term: string) {
  return `${restaurant.name} ${restaurant.cuisine ?? ""}`.toLowerCase().includes(term);
}

export function flatten(collection: RestaurantFeatureCollection): MapRestaurant[] {
  return collection.features.map((feature) => ({
    ...feature.properties,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
}

// What the list and the pins show: search term, then filter chip, shortest wait first.
export function visibleRestaurants(all: MapRestaurant[], rawTerm: string, filterId: MapFilterId) {
  const term = rawTerm.trim().toLowerCase();
  const filter = filterById(filterId);
  return all
    .filter((restaurant) => (!term || matchesTerm(restaurant, term)) && filter.test(restaurant))
    .sort((a, b) => waitSortKey(a) - waitSortKey(b));
}

function markerProperties({ longitude, latitude, ...restaurant }: MapRestaurant): MarkerProperties {
  void longitude;
  void latitude;
  const wait = estimateWait(restaurant);
  return {
    ...restaurant,
    shortLabel: wait.open ? `${wait.minutes}m` : CLOSED_MARK,
    longLabel: wait.open ? `${restaurant.name} · ${wait.minutes} min` : restaurant.name,
  };
}

export function toMarkers(restaurants: MapRestaurant[]): MarkerFeatureCollection {
  return {
    type: "FeatureCollection",
    features: restaurants.map((restaurant) => ({
      type: "Feature",
      id: restaurant.id,
      geometry: { type: "Point", coordinates: [restaurant.longitude, restaurant.latitude] },
      properties: markerProperties(restaurant),
    })),
  };
}
