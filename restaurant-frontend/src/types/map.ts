import type { RestaurantProperties } from "./api";

export type MapFilterId = "all" | "queueOpen" | "shortWait" | "budget";

// What each map pin carries: the restaurant plus the two texts its pill can show.
export type MarkerProperties = RestaurantProperties & {
  // "10m" on an unselected pill, "–" when the queue is closed.
  shortLabel: string;
  // "Nordic Table · 10 min" on the selected pill.
  longLabel: string;
};

export type MarkerFeatureCollection = {
  type: "FeatureCollection";
  features: {
    type: "Feature";
    id: string;
    geometry: { type: "Point"; coordinates: [number, number] };
    properties: MarkerProperties;
  }[];
};
