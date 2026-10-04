import { useCallback, useEffect, useRef, useState } from "react";
import { MapLibreMap, setWorkerUrl, type GeoJSONSource } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { getRestaurantsInBounds } from "../../lib/restaurants";
import type { MapRestaurant } from "../../types/api";
import type { MapFilterId } from "../../types/map";
import {
  MAP_STYLE,
  RESTAURANTS_LAYER,
  RESTAURANTS_SOURCE,
  SELECTED_PIN_OFFSET,
  START_CENTER,
  START_ZOOM,
  limitForZoom,
  selectedZoom,
} from "./map.constants";
import { EMPTY_MARKERS, flatten, toMarkers, visibleRestaurants } from "./mapData";
import { addPillImages, highlightMarker, markerLayer } from "./mapMarkers";
import { applyMapTheme } from "./mapTheme";

setWorkerUrl(maplibreWorkerUrl);

type Mutable<T> = { current: T };
type MapQuery = { term: string; filter: MapFilterId };

function useRestaurantData(mapRef: Mutable<MapLibreMap | null>, loadedRef: Mutable<MapRestaurant[]>) {
  const [restaurants, setRestaurants] = useState<MapRestaurant[]>([]);
  const [query, setQuery] = useState<MapQuery>({ term: "", filter: "all" });
  const [failed, setFailed] = useState(false);
  const queryRef = useRef(query);
  const pendingRef = useRef<AbortController | null>(null);
  const render = useCallback(() => {
    const visible = visibleRestaurants(loadedRef.current, queryRef.current.term, queryRef.current.filter);
    mapRef.current?.getSource<GeoJSONSource>(RESTAURANTS_SOURCE)?.setData(toMarkers(visible));
    setRestaurants(visible);
  }, [loadedRef, mapRef]);
  const update = useCallback((next: Partial<MapQuery>) => {
    queryRef.current = { ...queryRef.current, ...next };
    setQuery(queryRef.current);
    render();
  }, [render]);
  return {
    failed,
    filter: useCallback((filter: MapFilterId) => update({ filter }), [update]),
    filterId: query.filter,
    loadRestaurants: useMapLoader(mapRef, loadedRef, pendingRef, render, setFailed),
    pendingRef,
    restaurants,
    search: useCallback((term: string) => update({ term }), [update]),
    searchTerm: query.term,
  };
}

function useMapLoader(
  mapRef: Mutable<MapLibreMap | null>,
  loadedRef: Mutable<MapRestaurant[]>,
  pendingRef: Mutable<AbortController | null>,
  render: () => void,
  setFailed: (failed: boolean) => void,
) {
  return useCallback(async () => {
    const map = mapRef.current;
    if (!map) return;
    pendingRef.current?.abort();
    const controller = new AbortController();
    pendingRef.current = controller;
    const bounds = map.getBounds();
    try {
      const collection = await getRestaurantsInBounds({
        west: bounds.getWest(), south: bounds.getSouth(),
        east: bounds.getEast(), north: bounds.getNorth(),
        limit: limitForZoom(map.getZoom()),
      }, controller.signal);
      loadedRef.current = flatten(collection);
      setFailed(false);
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error("[map]", error);
      loadedRef.current = [];
      setFailed(true);
    }
    render();
  }, [loadedRef, mapRef, pendingRef, render, setFailed]);
}

function useRestaurantSelection(mapRef: Mutable<MapLibreMap | null>, loadedRef: Mutable<MapRestaurant[]>) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectRestaurant = useCallback((id: string) => {
    setSelectedId(id);
    const map = mapRef.current;
    if (!map) return;
    highlightMarker(map, id);
    const target = loadedRef.current.find((restaurant) => restaurant.id === id);
    if (!target) return;
    map.flyTo({
      center: [target.longitude, target.latitude],
      zoom: selectedZoom(map.getZoom()),
      offset: SELECTED_PIN_OFFSET,
    });
  }, [loadedRef, mapRef]);
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
  addPillImages(map);
  map.addSource(RESTAURANTS_SOURCE, { type: "geojson", data: EMPTY_MARKERS });
  map.addLayer(markerLayer());
  map.on("click", RESTAURANTS_LAYER, (event) => {
    const id = event.features?.[0]?.properties?.id;
    if (typeof id === "string") selectRestaurant(id);
  });
}

function useMapLifecycle(
  containerRef: Mutable<HTMLDivElement | null>,
  mapRef: Mutable<MapLibreMap | null>,
  pendingRef: Mutable<AbortController | null>,
  onLoad: () => void,
) {
  const [mapReady, setMapReady] = useState(false);
  useEffect(() => {
    if (!containerRef.current) return;
    const instance = createMap(containerRef.current);
    const resize = new ResizeObserver(() => instance.resize());
    mapRef.current = instance;
    instance.on("error", (event) => console.error("[map]", event.error));
    instance.on("load", () => {
      applyMapTheme(instance);
      onLoad();
      setMapReady(true);
      instance.on("moveend", onLoad);
    });
    resize.observe(containerRef.current);
    return () => {
      resize.disconnect();
      pendingRef.current?.abort();
      instance.remove();
      mapRef.current = null;
      setMapReady(false);
    };
  }, [containerRef, mapRef, onLoad, pendingRef]);
  return mapReady;
}

export function useRestaurantMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef<MapRestaurant[]>([]);
  const mapRef = useRef<MapLibreMap | null>(null);
  const { pendingRef, loadRestaurants, ...data } = useRestaurantData(mapRef, loadedRef);
  const { selectedId, selectRestaurant } = useRestaurantSelection(mapRef, loadedRef);
  const onLoad = useCallback(() => {
    if (mapRef.current && !mapRef.current.getSource(RESTAURANTS_SOURCE)) {
      setupRestaurantLayer(mapRef.current, selectRestaurant);
    }
    void loadRestaurants();
  }, [loadRestaurants, selectRestaurant]);
  const mapReady = useMapLifecycle(containerRef, mapRef, pendingRef, onLoad);
  return { containerRef, mapReady, selectedId, ...data };
}
