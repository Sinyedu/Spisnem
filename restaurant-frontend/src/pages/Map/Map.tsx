import { useEffect, useRef } from "react";
import { MapLibreMap, setWorkerUrl } from "maplibre-gl";
import maplibreWorkerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import BottomSheet from "../../components/map/BottomSheet/BottomSheet";
import "./Map.scss";

// maplibre-gl v6 ships its tile worker as a separate chunk and finds it from
// import.meta.url, which no bundler preserves — the worker then never starts and the
// map renders empty with no error at all. Letting Vite bundle it and pointing
// maplibre at the result is the only thing that works in dev and in the build.
setWorkerUrl(maplibreWorkerUrl);

// OpenFreeMap: free, no API key, no request limits, commercial use allowed.
// MapLibre adds the required OSM/OpenMapTiles attribution on its own.
// Swap for "positron" (minimal grey), "bright" or "dark" to restyle everything.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/liberty";

// Copenhagen until we centre on the user's location.
const START_CENTER: [number, number] = [12.5683, 55.6761];
const START_ZOOM = 13;

function Map() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;

    const map = new MapLibreMap({
      container: container.current,
      style: MAP_STYLE,
      center: START_CENTER,
      zoom: START_ZOOM,
      // Phone only: no keyboard panning, and the compass has nowhere to live.
      keyboard: false,
      attributionControl: { compact: true },
    });

    map.on("error", (event) => console.error("[map]", event.error));

    // The sheet animates over the map, so the canvas must re-measure after layout.
    const resize = new ResizeObserver(() => map.resize());
    resize.observe(container.current);

    return () => {
      resize.disconnect();
      map.remove();
    };
  }, []);

  return (
    <main className="map">
      <div className="map__canvas" ref={container} />

      <header className="map__top">
        <button className="map__icon" aria-label="Open menu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>

        <form className="map__search" onSubmit={(event) => event.preventDefault()}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input type="search" placeholder="Search restaurants" aria-label="Search restaurants" />
        </form>
      </header>

      <BottomSheet>
        {/* Placeholder content — real nearby restaurants land here later. */}
        <h2 className="map__heading">Nearby</h2>
        <ul className="map__list">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <li key={index} className="map__row">
              <span className="map__thumb" />
              <span className="map__lines">
                <span className="map__line" />
                <span className="map__line map__line--short" />
              </span>
            </li>
          ))}
        </ul>
      </BottomSheet>
    </main>
  );
}

export default Map;
