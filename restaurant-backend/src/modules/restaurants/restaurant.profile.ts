import { badRequest } from "../../shared/errors.js";
import type { RestaurantDoc, UpdateRestaurantProfileInput } from "../../types/index.js";
import { toGeoPoint } from "./restaurant.mapper.js";

// Fields that are stored under the same name they have in the API.
const PLAIN_FIELDS = [
  "name", "description", "phone", "address", "city", "postalCode", "countryCode",
  "heroImageUrl", "cuisine", "priceLevel", "averageWaitMinutes", "graceMinutes", "maxPartySize",
] as const;

// Latitude and longitude are stored together as one map point.
function locationChange(current: RestaurantDoc, input: UpdateRestaurantProfileInput) {
  if (input.latitude === undefined && input.longitude === undefined) return {};
  const latitude = input.latitude !== undefined ? input.latitude : (current.location?.coordinates[1] ?? null);
  const longitude = input.longitude !== undefined ? input.longitude : (current.location?.coordinates[0] ?? null);
  if ((latitude === null) !== (longitude === null)) {
    throw badRequest("Latitude and longitude must be set together", "INCOMPLETE_LOCATION");
  }
  return { location: toGeoPoint(latitude, longitude) };
}

// queueEnabled is the older switch; queueState wins when both are sent.
function queueStateChange(input: UpdateRestaurantProfileInput) {
  if (input.queueState) return { queueState: input.queueState };
  if (input.queueEnabled === undefined) return {};
  return { queueState: input.queueEnabled ? ("open" as const) : ("closed" as const) };
}

/** Turns a profile PATCH body into the document fields to $set. Unsent fields stay as they are. */
export function profileChanges(current: RestaurantDoc, input: UpdateRestaurantProfileInput): Partial<RestaurantDoc> {
  const changes: Partial<RestaurantDoc> = {};
  for (const field of PLAIN_FIELDS) {
    if (input[field] !== undefined) Object.assign(changes, { [field]: input[field] });
  }
  return { ...changes, ...locationChange(current, input), ...queueStateChange(input) };
}
