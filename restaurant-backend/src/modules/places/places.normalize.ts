import type { Place } from "../../types/index.js";

// Raw element as returned by the Overpass API.
export type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function toPlace(element: OverpassElement): Place | null {
  const tags = element.tags ?? {};
  const name = tags.name;
  // Nodes carry lat/lon directly; ways/relations carry a computed center.
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  if (!name || latitude === undefined || longitude === undefined) return null;

  const street = tags["addr:street"];
  const address = street ? [street, tags["addr:housenumber"]].filter(Boolean).join(" ") : null;

  return {
    id: `${element.type}/${element.id}`,
    name,
    latitude,
    longitude,
    category: tags.amenity ?? "restaurant",
    cuisine: tags.cuisine ?? null,
    address,
  };
}

// Keep only named, locatable food places. Pure — unit tested.
export function toPlaces(elements: OverpassElement[]): Place[] {
  return elements.map(toPlace).filter((place): place is Place => place !== null);
}
