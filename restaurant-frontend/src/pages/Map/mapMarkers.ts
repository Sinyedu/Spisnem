import type {
  ExpressionSpecification,
  MapLibreMap,
  SymbolLayerSpecification,
} from "maplibre-gl";
import {
  MARKER_COLOURS,
  MARKER_FONT,
  MARKER_TEXT_SIZE,
  RESTAURANTS_LAYER,
  RESTAURANTS_SOURCE,
} from "./map.constants";

// Pins are pills that show the wait ("10m"). Each pill is a small rounded image that
// MapLibre stretches around the text, so no HTML markers are needed.
const PIXEL_RATIO = 2;
const PILL_HEIGHT = 56; // image pixels, i.e. 28 CSS px
const PILL_WIDTH = 96;
const PILL_RADIUS = PILL_HEIGHT / 2;
// Space between the text and the pill edge: [top, right, bottom, left] in CSS px.
const PILL_PADDING: [number, number, number, number] = [4, 10, 4, 10];

const PILLS = {
  open: "pill-open",
  closed: "pill-closed",
  selected: "pill-selected",
} as const;

function drawPill(fill: string) {
  const canvas = document.createElement("canvas");
  canvas.width = PILL_WIDTH;
  canvas.height = PILL_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas 2d context unavailable");
  context.fillStyle = fill;
  context.strokeStyle = MARKER_COLOURS.border;
  context.lineWidth = PIXEL_RATIO;
  context.beginPath();
  context.roundRect(1, 1, PILL_WIDTH - 2, PILL_HEIGHT - 2, PILL_RADIUS - 1);
  context.fill();
  context.stroke();
  return context.getImageData(0, 0, PILL_WIDTH, PILL_HEIGHT);
}

function addPill(map: MapLibreMap, id: string, fill: string) {
  if (map.hasImage(id)) return;
  map.addImage(id, drawPill(fill), {
    pixelRatio: PIXEL_RATIO,
    // Only the straight middle stretches, so the round ends keep their shape.
    stretchX: [[PILL_RADIUS, PILL_WIDTH - PILL_RADIUS]],
    stretchY: [[PILL_RADIUS - 1, PILL_RADIUS + 1]],
    content: [PILL_RADIUS, 0, PILL_WIDTH - PILL_RADIUS, PILL_HEIGHT],
  });
}

export function addPillImages(map: MapLibreMap) {
  addPill(map, PILLS.open, MARKER_COLOURS.open);
  addPill(map, PILLS.closed, MARKER_COLOURS.closed);
  addPill(map, PILLS.selected, MARKER_COLOURS.selected);
}

function isSelected(id: string | null): ExpressionSpecification {
  return ["==", ["get", "id"], id ?? ""];
}

function markerStyle(selectedId: string | null) {
  const selected = isSelected(selectedId);
  const open: ExpressionSpecification = ["get", "queueEnabled"];
  return {
    text: ["case", selected, ["get", "longLabel"], ["get", "shortLabel"]] as ExpressionSpecification,
    icon: ["case", selected, PILLS.selected, open, PILLS.open, PILLS.closed] as ExpressionSpecification,
    colour: ["case", selected, MARKER_COLOURS.selectedText, open, MARKER_COLOURS.text, MARKER_COLOURS.mutedText] as ExpressionSpecification,
    // Higher keys are placed last, so the selected pill sits on top.
    sortKey: ["case", selected, 1, 0] as ExpressionSpecification,
  };
}

export function markerLayer(): SymbolLayerSpecification {
  const style = markerStyle(null);
  return {
    id: RESTAURANTS_LAYER,
    type: "symbol",
    source: RESTAURANTS_SOURCE,
    layout: {
      "text-field": style.text,
      "text-font": MARKER_FONT,
      "text-size": MARKER_TEXT_SIZE,
      "icon-image": style.icon,
      "icon-text-fit": "both",
      "icon-text-fit-padding": PILL_PADDING,
      "icon-allow-overlap": true,
      "text-allow-overlap": true,
      "symbol-sort-key": style.sortKey,
    },
    paint: { "text-color": style.colour },
  };
}

export function highlightMarker(map: MapLibreMap, selectedId: string | null) {
  const style = markerStyle(selectedId);
  map.setLayoutProperty(RESTAURANTS_LAYER, "text-field", style.text);
  map.setLayoutProperty(RESTAURANTS_LAYER, "icon-image", style.icon);
  map.setLayoutProperty(RESTAURANTS_LAYER, "symbol-sort-key", style.sortKey);
  map.setPaintProperty(RESTAURANTS_LAYER, "text-color", style.colour);
}
