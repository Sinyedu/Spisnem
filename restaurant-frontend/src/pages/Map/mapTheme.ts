import type { MapLibreMap } from "maplibre-gl";

// Terracotta is deliberately absent: it belongs to the selected marker alone, so
// keeping it out of the basemap is what makes the pins readable.
const COLOURS = {
  background: "#f4efe8",
  water: "#cfe0ea",
  green: "#dbe6cf",
  building: "#ebe4da",
  buildingOutline: "#e2d9cc",
  road: "#ffffff",
  roadCasing: "#e2d9cc",
  label: "#9a8e84",
  labelHalo: "#ffffff",
};

const GREEN_SOURCE_LAYERS = new Set(["park", "landcover", "landuse"]);
const WATER_SOURCE_LAYERS = new Set(["water", "waterway"]);
const ROAD_SOURCE_LAYERS = new Set(["transportation", "aeroway"]);

/**
 * Recolours the basemap to the Spisnem palette. Positron carries no POI layers, so
 * the only businesses on the map are already the ones we serve.
 */
export function applyMapTheme(map: MapLibreMap) {
  for (const layer of map.getStyle().layers) {
    const sourceLayer = "source-layer" in layer ? layer["source-layer"] : undefined;

    if (layer.type === "background") {
      map.setPaintProperty(layer.id, "background-color", COLOURS.background);
      continue;
    }

    if (layer.type === "symbol") {
      map.setPaintProperty(layer.id, "text-color", COLOURS.label);
      map.setPaintProperty(layer.id, "text-halo-color", COLOURS.labelHalo);
      continue;
    }

    if (!sourceLayer) continue;

    const fill =
      WATER_SOURCE_LAYERS.has(sourceLayer) ? COLOURS.water
      : GREEN_SOURCE_LAYERS.has(sourceLayer) ? COLOURS.green
      : sourceLayer === "building" ? COLOURS.building
      : ROAD_SOURCE_LAYERS.has(sourceLayer) ?
        // Casing layers sit under the road fill and give it its edge.
        (layer.id.includes("casing") ? COLOURS.roadCasing : COLOURS.road)
      : null;

    if (!fill) continue;

    if (layer.type === "fill") {
      map.setPaintProperty(layer.id, "fill-color", fill);
      if (sourceLayer === "building") {
        map.setPaintProperty(layer.id, "fill-outline-color", COLOURS.buildingOutline);
      }
    } else if (layer.type === "line") {
      map.setPaintProperty(layer.id, "line-color", fill);
    }
  }
}
