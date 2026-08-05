import L from "leaflet";

const star =
  '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.98 6.99 19.5l.99-5.8-4.21-4.1 5.82-.85z"/></svg>';

export function restaurantPin(rating: number | null): L.DivIcon {
  const variant = rating != null && rating >= 4.5 ? "red" : "dark";
  const label = rating != null ? rating.toFixed(1) : "–";
  return L.divIcon({
    className: "map-pin-wrap",
    html: `<div class="map-pin map-pin--${variant}">${star}<span>${label}</span></div>`,
    iconSize: [56, 30],
    iconAnchor: [28, 34],
  });
}

export function userPin(): L.DivIcon {
  return L.divIcon({
    className: "map-pin-wrap",
    html: '<div class="map-user"><span class="map-user__dot"></span></div>',
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}
