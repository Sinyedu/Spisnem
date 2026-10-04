import { staffUsers } from "../../database/collections.js";
import type { StaffUser } from "../../types/index.js";
import { findRestaurantById } from "../restaurants/restaurant.repository.js";

/** A staff login and the restaurant they belong to (the first one, as before). */
export async function findStaffUserByEmail(email: string): Promise<StaffUser | null> {
  const user = await staffUsers.findOne({ emailLower: email.toLowerCase() });
  if (!user) return null;
  const membership = user.memberships[0] ?? null;
  const restaurant = membership ? await findRestaurantById(membership.restaurantId) : null;
  return {
    id: user._id,
    email: user.email,
    passwordHash: user.passwordHash,
    displayName: user.displayName,
    restaurantId: membership?.restaurantId ?? null,
    role: membership?.role ?? null,
    restaurantName: restaurant?.name ?? null,
  };
}
