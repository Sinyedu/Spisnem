import type { CircleLayerSpecification } from "maplibre-gl";

// OpenFreeMap: free, no API key, no request limits, commercial use allowed.
// MapLibre adds the required OSM/OpenMapTiles attribution on its own.
// Positron is a near-monochrome base; applyMapTheme repaints it in our palette.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

// Copenhagen until we centre on the user's location.
export const START_CENTER: [number, number] = [12.5683, 55.6761];
export const START_ZOOM = 13;

export const RESTAURANTS_SOURCE = "restaurants";
export const RESTAURANTS_LAYER = "restaurant-points";

// The only brand red on the map — the basemap stays neutral so markers stand out.
// Mirrors $color-primary in styles/abstracts/_colors.scss.
export const RESTAURANT_MARKER_PAINT: CircleLayerSpecification["paint"] = {
  "circle-radius": 8,
  "circle-color": "#c1392b",
  "circle-stroke-width": 3,
  "circle-stroke-color": "#fff",
};

// Denser viewports can afford more pins without the map turning to soup.
export function limitForZoom(zoom: number) {
  if (zoom >= 15) return 100;
  if (zoom >= 13) return 50;
  return 25;
}
