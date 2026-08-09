import { useCallback, useEffect, useRef, useState } from "react";
import { MapLibreMap, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { getRestaurantsInBounds } from "../../lib/restaurants";
import type { MapRestaurant } from "../../types/api";
import {
  MAP_STYLE,
  RESTAURANTS_LAYER,
  RESTAURANTS_SOURCE,
  RESTAURANT_MARKER_PAINT,
  START_CENTER,
  START_ZOOM,
  limitForZoom,
} from "./map.constants";
import { applyMapTheme } from "./mapTheme";

// maplibre-gl v6 ships its tile worker as a separate chunk and finds it from
// import.meta.url, which no bundler preserves — the worker then never starts and the
// map renders empty with no error at all. Letting Vite bundle it and pointing
// maplibre at the result is the only thing that works in dev and in the build.
setWorkerUrl(maplibreWorkerUrl);

/**
 * Owns the MapLibre instance: creation, the restaurant layer, and reloading
 * restaurants whenever the viewport settles. Returns the ref to attach to the
 * canvas element plus the restaurants currently in view.
 */
export function useRestaurantMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap>(null);
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Only the newest viewport matters, so an in-flight request is dropped when the
  // map moves again.
  const pending = useRef<AbortController>(null);

  const loadRestaurants = useCallback(async () => {
    if (!map.current) return;

    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;

    const bounds = map.current.getBounds();

    try {
      const collection = await getRestaurantsInBounds(
        {
          west: bounds.getWest(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          north: bounds.getNorth(),
          limit: limitForZoom(map.current.getZoom()),
        },
        controller.signal,
      );

      map.current.getSource<GeoJSONSource>(RESTAURANTS_SOURCE)?.setData(collection);
      setRestaurants(collection.features.map((feature) => feature.properties));
    } catch (error) {
      if (!controller.signal.aborted) console.error("[map]", error);
    }
  }, []);

  useEffect(() => {
    if (!container.current) return;

    const instance = new MapLibreMap({
      container: container.current,
      style: MAP_STYLE,
      center: START_CENTER,
      zoom: START_ZOOM,
      // Phone only: no keyboard panning, and the compass has nowhere to live.
      keyboard: false,
      attributionControl: { compact: true },
    });
    map.current = instance;

    instance.on("error", (event) => console.error("[map]", event.error));

    instance.on("load", () => {
      applyMapTheme(instance);

      instance.addSource(RESTAURANTS_SOURCE, {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      instance.addLayer({
        id: RESTAURANTS_LAYER,
        type: "circle",
        source: RESTAURANTS_SOURCE,
        paint: RESTAURANT_MARKER_PAINT,
      });

      instance.on("click", RESTAURANTS_LAYER, (event) => {
        const id = event.features?.[0]?.properties?.id;
        if (typeof id === "string") setSelectedId(id);
      });

      instance.on("mouseenter", RESTAURANTS_LAYER, () => {
        instance.getCanvas().style.cursor = "pointer";
      });
      instance.on("mouseleave", RESTAURANTS_LAYER, () => {
        instance.getCanvas().style.cursor = "";
      });

      void loadRestaurants();
    });

    // Fetching on "move" would fire on every animation frame.
    instance.on("moveend", () => void loadRestaurants());

    // The sheet animates over the map, so the canvas must re-measure after layout.
    const resize = new ResizeObserver(() => instance.resize());
    resize.observe(container.current);

    return () => {
      resize.disconnect();
      pending.current?.abort();
      instance.remove();
      map.current = null;
    };
  }, [loadRestaurants]);

  return { container, restaurants, selectedId, selectRestaurant: setSelectedId };
}
