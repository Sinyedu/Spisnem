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

setWorkerUrl(maplibreWorkerUrl);

const EMPTY: RestaurantFeatureCollection = { type: "FeatureCollection", features: [] };
type Mutable<T> = { current: T };

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

function toFeatureCollection(restaurants: MapRestaurant[]): RestaurantFeatureCollection {
  return {
    type: "FeatureCollection",
    features: restaurants.map(({ longitude, latitude, ...properties }) => ({
      type: "Feature",
      id: properties.id,
      geometry: { type: "Point", coordinates: [longitude, latitude] },
      properties,
    })),
  };
}

function useRestaurantData(
  map: Mutable<MapLibreMap | null>,
  loaded: Mutable<MapRestaurant[]>,
  query: Mutable<string>,
) {
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [failed, setFailed] = useState(false);
  const pending = useRef<AbortController | null>(null);
  const render = useCallback(() => {
    const term = query.current.trim().toLowerCase();
    const visible = term ? loaded.current.filter((r) => matches(r, term)) : loaded.current;
    map.current?.getSource<GeoJSONSource>(RESTAURANTS_SOURCE)?.setData(toFeatureCollection(visible));
    setRestaurants(visible);
  }, [loaded, map, query]);
  const search = useCallback((term: string) => {
    query.current = term;
    setSearchTerm(term);
    render();
  }, [query, render]);
  return { failed, loadRestaurants: useMapLoader(map, loaded, pending, render, setFailed), pending, restaurants, search, searchTerm };
}

function useMapLoader(
  map: Mutable<MapLibreMap | null>,
  loaded: Mutable<MapRestaurant[]>,
  pending: Mutable<AbortController | null>,
  render: () => void,
  setFailed: (failed: boolean) => void,
) {
  return useCallback(async () => {
    if (!map.current) return;
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    const bounds = map.current.getBounds();
    try {
      const collection = await getRestaurantsInBounds({
        west: bounds.getWest(), south: bounds.getSouth(),
        east: bounds.getEast(), north: bounds.getNorth(),
        limit: limitForZoom(map.current.getZoom()),
      }, controller.signal);
      loaded.current = flatten(collection);
      setFailed(false);
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("[map]", error);
      loaded.current = [];
      setFailed(true);
    }
    render();
  }, [loaded, map, pending, render, setFailed]);
}

function useRestaurantSelection(map: Mutable<MapLibreMap | null>, loaded: Mutable<MapRestaurant[]>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectRestaurant = useCallback((id: string) => {
    setSelectedId(id);
    map.current?.setPaintProperty(RESTAURANTS_LAYER, "circle-radius", [
      "case", ["==", ["get", "id"], id], SELECTED_MARKER_RADIUS, MARKER_RADIUS,
    ]);
    const target = loaded.current.find((restaurant) => restaurant.id === id);
    if (!target || !map.current) return;
    map.current.flyTo({ center: [target.longitude, target.latitude], zoom: selectedZoom(map.current.getZoom()) });
  }, [loaded, map]);
  return { selectedId, selectRestaurant };
}

function createMap(container: HTMLDivElement) {
  return new MapLibreMap({
    container,
    style: MAP_STYLE,
    center: START_CENTER,
    zoom: START_ZOOM,
    keyboard: false,
    attributionControl: { compact: true },
  });
}

function setupRestaurantLayer(map: MapLibreMap, selectRestaurant: (id: string) => void) {
  map.addSource(RESTAURANTS_SOURCE, { type: "geojson", data: EMPTY });
  map.addLayer({
    id: RESTAURANTS_LAYER,
    type: "circle",
    source: RESTAURANTS_SOURCE,
    paint: RESTAURANT_MARKER_PAINT,
  });
  map.on("click", RESTAURANTS_LAYER, (event) => {
    const id = event.features?.[0]?.properties?.id;
    if (typeof id === "string") selectRestaurant(id);
  });
}

function useMapLifecycle(
  container: Mutable<HTMLDivElement | null>,
  map: Mutable<MapLibreMap | null>,
  pending: Mutable<AbortController | null>,
  onLoad: () => void,
) {
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => {
    if (!container.current) return;
    const instance = createMap(container.current);
    const resize = new ResizeObserver(() => instance.resize());
    map.current = instance;
    instance.on("error", (event) => console.error("[map]", event.error));
    instance.on("load", () => {
      applyMapTheme(instance);
      onLoad();
      setMapReady(true);
      instance.on("moveend", onLoad);
    });
    resize.observe(container.current);
    return () => {
      resize.disconnect();
      pending.current?.abort();
      instance.remove();
      map.current = null;
      setMapReady(false);
    };
  }, [container, map, onLoad, pending]);
  return mapReady;
}

export function useRestaurantMap() {
  const container = useRef<HTMLDivElement | null>(null);
  const loaded = useRef<MapRestaurant[]>([]);
  const map = useRef<MapLibreMap | null>(null);
  const query = useRef("");
  const data = useRestaurantData(map, loaded, query);
  const selection = useRestaurantSelection(map, loaded);
  const onLoad = useCallback(() => {
    if (map.current && !map.current.getSource(RESTAURANTS_SOURCE)) {
      setupRestaurantLayer(map.current, selection.selectRestaurant);
    }
    void data.loadRestaurants();
  }, [data.loadRestaurants, selection.selectRestaurant]);
  const mapReady = useMapLifecycle(container, map, data.pending, onLoad);
  return { container, mapReady, selectedId: selection.selectedId, ...data };
}
