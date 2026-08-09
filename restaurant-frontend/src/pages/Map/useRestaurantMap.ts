import { useCallback, useEffect, useRef, useState } from "react";
import { MapLibreMap, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { getRestaurantsInBounds } from "../../lib/restaurants";
import type { MapRestaurant, RestaurantFeatureCollection } from "../../types/api";
import {
  MAP_STYLE,
  MARKER_RADIUS,
  RESTAURANTS_LAYER,
  RESTAURANTS_SOURCE,
  RESTAURANT_MARKER_PAINT,
  SELECTED_MARKER_RADIUS,
  START_CENTER,
  START_ZOOM,
  limitForZoom,
  selectedZoom,
} from "./map.constants";
import { applyMapTheme } from "./mapTheme";

// maplibre-gl v6 ships its tile worker as a separate chunk and finds it from
// import.meta.url, which no bundler preserves — the worker then never starts and the
// map renders empty with no error at all. Letting Vite bundle it and pointing
// maplibre at the result is the only thing that works in dev and in the build.
setWorkerUrl(maplibreWorkerUrl);

const EMPTY: RestaurantFeatureCollection = { type: "FeatureCollection", features: [] };

function matches(restaurant: MapRestaurant, term: string) {
  return `${restaurant.name} ${restaurant.cuisine ?? ""}`.toLowerCase().includes(term);
}

function flatten(collection: RestaurantFeatureCollection): MapRestaurant[] {
  return collection.features.map((feature) => ({
    ...feature.properties,
    longitude: feature.geometry.coordinates[0],
    latitude: feature.geometry.coordinates[1],
  }));
}

/**
 * Owns the MapLibre instance: creation, the restaurant layer, reloading restaurants
 * when the viewport settles, and keeping the map and the list showing the same
 * filtered set.
 */
export function useRestaurantMap() {
  const container = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreMap>(null);

  // Everything the last request returned, before the search filter is applied.
  const loaded = useRef<MapRestaurant[]>([]);
  const query = useRef("");

  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [failed, setFailed] = useState(false);

  // Only the newest viewport matters, so an in-flight request is dropped when the
  // map moves again.
  const pending = useRef<AbortController>(null);

  // The map and the list always render the same filtered set.
  const render = useCallback(() => {
    const term = query.current.trim().toLowerCase();
    const visible = term ? loaded.current.filter((r) => matches(r, term)) : loaded.current;

    map.current?.getSource<GeoJSONSource>(RESTAURANTS_SOURCE)?.setData({
      type: "FeatureCollection",
      features: visible.map(({ longitude, latitude, ...properties }) => ({
        type: "Feature",
        id: properties.id,
        geometry: { type: "Point", coordinates: [longitude, latitude] },
        properties,
      })),
    });

    setRestaurants(visible);
  }, []);

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

      loaded.current = flatten(collection);
      setFailed(false);
      render();
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("[map]", error);
      loaded.current = [];
      setFailed(true);
      render();
    }
  }, [render]);

  const search = useCallback(
    (term: string) => {
      query.current = term;
      setSearchTerm(term);
      render();
    },
    [render],
  );

  const selectRestaurant = useCallback((id: string) => {
    setSelectedId(id);

    map.current?.setPaintProperty(RESTAURANTS_LAYER, "circle-radius", [
      "case",
      ["==", ["get", "id"], id],
      SELECTED_MARKER_RADIUS,
      MARKER_RADIUS,
    ]);

    const target = loaded.current.find((restaurant) => restaurant.id === id);
    if (!target || !map.current) return;

    map.current.flyTo({
      center: [target.longitude, target.latitude],
      zoom: selectedZoom(map.current.getZoom()),
    });
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

      instance.addSource(RESTAURANTS_SOURCE, { type: "geojson", data: EMPTY });
      instance.addLayer({
        id: RESTAURANTS_LAYER,
        type: "circle",
        source: RESTAURANTS_SOURCE,
        paint: RESTAURANT_MARKER_PAINT,
      });

      instance.on("click", RESTAURANTS_LAYER, (event) => {
        const id = event.features?.[0]?.properties?.id;
        if (typeof id === "string") selectRestaurant(id);
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
  }, [loadRestaurants, selectRestaurant]);

  return { container, restaurants, selectedId, selectRestaurant, searchTerm, search, failed };
}
