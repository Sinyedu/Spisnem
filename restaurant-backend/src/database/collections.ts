import type {
  FavouriteDoc,
  MenuCategoryDoc,
  MenuItemDoc,
  QueueEntryDoc,
  QueueEventDoc,
  RestaurantDoc,
  StaffUserDoc,
  TableDoc,
} from "../types/documents.js";
import { db } from "./mongo.js";

// One typed handle per collection. Better Auth keeps its own collections
// ("user", "session", "account", "verification") through its MongoDB adapter.
export const restaurants = db.collection<RestaurantDoc>("restaurants");
export const staffUsers = db.collection<StaffUserDoc>("staff_users");
export const queueEntries = db.collection<QueueEntryDoc>("queue_entries");
export const queueEvents = db.collection<QueueEventDoc>("queue_events");
export const restaurantTables = db.collection<TableDoc>("restaurant_tables");
export const menuCategories = db.collection<MenuCategoryDoc>("menu_categories");
export const menuItems = db.collection<MenuItemDoc>("menu_items");
export const favourites = db.collection<FavouriteDoc>("favourites");
