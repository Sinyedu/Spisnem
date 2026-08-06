import { fetchFoodPlaces } from "./places.client.js";
import { toPlaces } from "./places.normalize.js";

export async function getFoodPlaces(lat: number, lng: number, radius: number) {
  const elements = await fetchFoodPlaces(lat, lng, radius);
  return toPlaces(elements);
}
