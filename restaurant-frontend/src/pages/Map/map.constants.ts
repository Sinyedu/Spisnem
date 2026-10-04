// OpenFreeMap: free, no API key, no request limits, commercial use allowed.
// MapLibre adds the required OSM/OpenMapTiles attribution on its own.
// Positron is a near-monochrome base; applyMapTheme repaints it in our palette.
export const MAP_STYLE = "https://tiles.openfreemap.org/styles/positron";

// Copenhagen until we centre on the user's location.
export const START_CENTER: [number, number] = [12.5683, 55.6761];
export const START_ZOOM = 13;

export const RESTAURANTS_SOURCE = "restaurants";
export const RESTAURANTS_LAYER = "restaurant-markers";

// Positron ships these glyphs, so marker text needs no extra font download.
export const MARKER_FONT = ["Noto Sans Bold"];
export const MARKER_TEXT_SIZE = 12;

// Mirrors styles/abstracts/_colors.scss. Terracotta is reserved for the selected pin.
export const MARKER_COLOURS = {
  open: "#ffffff",
  closed: "#f1e9de",
  selected: "#a8320e",
  border: "rgba(27, 20, 17, 0.14)",
  text: "#1b1411",
  mutedText: "#6f625a",
  selectedText: "#ffffff",
} as const;

// Denser viewports can afford more pins without the map turning to soup.
export function limitForZoom(zoom: number) {
  if (zoom >= 15) return 100;
  if (zoom >= 13) return 50;
  return 25;
}

// Picking a restaurant zooms in, but never back out if you are already close.
export function selectedZoom(currentZoom: number) {
  return Math.max(currentZoom, 15);
}

// Keeps the chosen pin in the open map area above the bottom sheet (pixels).
export const SELECTED_PIN_OFFSET: [number, number] = [0, -120];
