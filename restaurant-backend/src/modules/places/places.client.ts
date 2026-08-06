import { env } from "../../config/env.js";
import { AppError } from "../../shared/errors.js";
import type { OverpassElement } from "./places.normalize.js";

const AMENITIES = "restaurant|cafe|bar|fast_food|pub|food_court";

// Fetches food POIs within `radius` metres of (lat, lng) from the Overpass API.
export async function fetchFoodPlaces(
  lat: number,
  lng: number,
  radius: number,
): Promise<OverpassElement[]> {
  const query = `[out:json][timeout:25];
(
  node["amenity"~"^(${AMENITIES})$"](around:${radius},${lat},${lng});
  way["amenity"~"^(${AMENITIES})$"](around:${radius},${lat},${lng});
);
out center 80;`;

  let response: Response;
  try {
    response = await fetch(env.OVERPASS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
        // OSM usage policy requires a descriptive User-Agent; requests without one get 406.
        "User-Agent": "Spisnem/1.0 (+https://github.com/Sinyedu/Spisnem)",
        Accept: "application/json",
      },
      body: query,
      signal: AbortSignal.timeout(25_000),
    });
  } catch {
    throw new AppError(502, "PLACES_UNAVAILABLE", "Could not reach the places provider.");
  }

  if (!response.ok) {
    throw new AppError(502, "PLACES_UNAVAILABLE", "The places provider returned an error.");
  }

  const body = (await response.json()) as { elements?: OverpassElement[] };
  return body.elements ?? [];
}
