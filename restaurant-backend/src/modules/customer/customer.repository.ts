import { favourites } from "../../database/collections.js";
import { newId } from "../../shared/ids.js";

export function listFavourites(customerUserId: string) {
  return favourites.find({ customerUserId }).sort({ createdAt: -1 }).toArray();
}

// Adding the same restaurant twice is harmless: the second call changes nothing.
export async function addFavourite(customerUserId: string, restaurantId: string) {
  await favourites.updateOne(
    { customerUserId, restaurantId },
    { $setOnInsert: { _id: newId(), customerUserId, restaurantId, createdAt: new Date() } },
    { upsert: true },
  );
}

export async function removeFavourite(customerUserId: string, restaurantId: string) {
  await favourites.deleteOne({ customerUserId, restaurantId });
}
