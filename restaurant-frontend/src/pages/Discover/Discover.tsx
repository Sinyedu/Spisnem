import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import Chip from "../../components/Chip";
import Spinner from "../../components/Spinner";
import RatingBadge from "../../components/RatingBadge";
import { ChevronDownIcon, ChevronUpIcon, LocationIcon, SearchIcon } from "../../components/icons";
import { getRestaurants } from "../../lib/api";
import { formatWait } from "../../lib/format";
import { bgImage } from "../../lib/style";
import type { Restaurant } from "../../types/api";
import { restaurantPin, userPin } from "./mapPins";
import "./Discover.scss";

const CPH: [number, number] = [55.6849, 12.56];

type Filter = "all" | "open" | "top" | "nearby";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open now" },
  { key: "top", label: "Top rated" },
  { key: "nearby", label: "Nearby" },
];

function distance(a: [number, number], b: [number, number]) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

// Keeps Leaflet sized correctly once its flex container has real dimensions.
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

// Flies the map to a target whenever it changes (used by the locate button).
function FlyTo({ target }: { target: { pos: [number, number]; ts: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target.pos, 15, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function Discover() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [listOpen, setListOpen] = useState(false);
  const [userLoc, setUserLoc] = useState<[number, number] | null>(null);
  const [flyTo, setFlyTo] = useState<{ pos: [number, number]; ts: number } | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLoc([pos.coords.latitude, pos.coords.longitude]),
      () => undefined,
      { enableHighAccuracy: false, timeout: 5000 },
    );
  }, []);

  function locate() {
    if (userLoc) {
      setFlyTo({ pos: userLoc, ts: Date.now() });
      return;
    }
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc: [number, number] = [pos.coords.latitude, pos.coords.longitude];
      setUserLoc(loc);
      setFlyTo({ pos: loc, ts: Date.now() });
    });
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["restaurants", debounced],
    queryFn: () => getRestaurants(debounced || undefined),
  });

  const origin = userLoc ?? CPH;

  const results = useMemo(() => {
    const list = [...(data ?? [])];
    if (filter === "open") return list.filter((r) => r.queueEnabled);
    if (filter === "top") return list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (filter === "nearby") {
      return list.sort((a, b) => {
        if (a.latitude == null || a.longitude == null) return 1;
        if (b.latitude == null || b.longitude == null) return -1;
        return (
          distance(origin, [a.latitude, a.longitude]) -
          distance(origin, [b.latitude, b.longitude])
        );
      });
    }
    return list;
  }, [data, filter, origin]);

  const mapped = useMemo(
    () =>
      results.filter(
        (r): r is Restaurant & { latitude: number; longitude: number } =>
          r.latitude != null && r.longitude != null,
      ),
    [results],
  );

  // Build each pin once per result set instead of re-allocating on every render.
  const pinIcons = useMemo(() => {
    const icons = new Map<string, ReturnType<typeof restaurantPin>>();
    for (const r of mapped) icons.set(r.id, restaurantPin(r.rating));
    return icons;
  }, [mapped]);
  const userIcon = useMemo(() => userPin(), []);

  return (
    <div className="discover">
      <div className="discover__top">
        <label className="discover__search">
          <SearchIcon size={20} />
          <input
            placeholder="Search restaurants…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="discover__chips">
          {FILTERS.map((f) => (
            <Chip key={f.key} active={filter === f.key} onClick={() => setFilter(f.key)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="discover__map">
        <MapContainer center={origin} zoom={13} zoomControl={false} className="discover__leaflet">
          <ResizeFix />
          <FlyTo target={flyTo} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {userLoc && <Marker position={userLoc} icon={userIcon} />}
          {mapped.map((r) => (
            <Marker
              key={r.id}
              position={[r.latitude, r.longitude]}
              icon={pinIcons.get(r.id)!}
              eventHandlers={{ click: () => navigate(`/r/${r.slug}`) }}
            />
          ))}
        </MapContainer>

        {isLoading && (
          <div className="discover__overlay">
            <Spinner label="Finding places nearby…" />
          </div>
        )}
        {isError && (
          <div className="discover__overlay">
            <p className="discover__error">Couldn't load restaurants. Is the API running?</p>
          </div>
        )}
      </div>

      <section className={`discover__sheet ${listOpen ? "discover__sheet--open" : ""}`}>
        <button className="discover__sheet-head" onClick={() => setListOpen((v) => !v)}>
          <span className="discover__sheet-title">
            Show list · {results.length} nearby
          </span>
          {listOpen ? <ChevronDownIcon size={20} /> : <ChevronUpIcon size={20} />}
        </button>

        <div className="discover__list">
          {results.map((r) => (
            <button
              key={r.id}
              className="discover__item"
              onClick={() => navigate(`/r/${r.slug}`)}
            >
              <div className="discover__thumb" style={bgImage(r.heroImageUrl)} />
              <div className="discover__item-body">
                <span className="discover__item-name">{r.name}</span>
                <span className="discover__item-meta">
                  {/* queueEnabled is used as an open/closed proxy until real opening hours exist. */}
                  {[r.city, r.queueEnabled ? "Open" : "Closed", formatWait(r.averageWaitMinutes)]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
              <RatingBadge rating={r.rating} variant="light" />
            </button>
          ))}
          {results.length === 0 && !isLoading && (
            <p className="discover__empty">No places match your search.</p>
          )}
        </div>
      </section>

      <button className="discover__locate" aria-label="Center on my location" onClick={locate}>
        <LocationIcon size={22} />
      </button>
    </div>
  );
}
