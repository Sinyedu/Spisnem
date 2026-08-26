import { pool } from "./pool.js";

// Demo data for the map. These are invented venues, not real businesses.
const restaurants = [
  { name: "Nordic Table", slug: "nordic-table", cuisine: "Nordic", priceLevel: 3, address: "Bredgade 12", postalCode: "1260", latitude: 55.6845, longitude: 12.5905 },
  { name: "Pasta Social", slug: "pasta-social", cuisine: "Italian", priceLevel: 2, address: "Istedgade 44", postalCode: "1650", latitude: 55.6702, longitude: 12.5546 },
  { name: "Tokyo Bowl", slug: "tokyo-bowl", cuisine: "Japanese", priceLevel: 2, address: "Gothersgade 21", postalCode: "1123", latitude: 55.6832, longitude: 12.5812 },
  { name: "Copenhagen Burger Co.", slug: "copenhagen-burger-co", cuisine: "Burgers", priceLevel: 1, address: "Vesterbrogade 90", postalCode: "1620", latitude: 55.6721, longitude: 12.5487 },
  { name: "Green Kitchen", slug: "green-kitchen", cuisine: "Vegetarian", priceLevel: 2, address: "Blågårdsgade 5", postalCode: "2200", latitude: 55.6879, longitude: 12.5561 },
  { name: "Nørrebro Pizza", slug: "norrebro-pizza", cuisine: "Pizza", priceLevel: 1, address: "Nørrebrogade 155", postalCode: "2200", latitude: 55.6941, longitude: 12.5473 },
  { name: "Harbour Bistro", slug: "harbour-bistro", cuisine: "French", priceLevel: 3, address: "Nyhavn 31", postalCode: "1051", latitude: 55.6797, longitude: 12.5901 },
  { name: "Seoul Kitchen", slug: "seoul-kitchen", cuisine: "Korean", priceLevel: 2, address: "Amagerbrogade 62", postalCode: "2300", latitude: 55.6608, longitude: 12.5983 },
  { name: "Coffee District", slug: "coffee-district", cuisine: "Café", priceLevel: 1, address: "Ravnsborggade 8", postalCode: "2200", latitude: 55.6893, longitude: 12.5628 },
  { name: "Østerbro Grill", slug: "osterbro-grill", cuisine: "Grill", priceLevel: 2, address: "Østerbrogade 101", postalCode: "2100", latitude: 55.7062, longitude: 12.5769 },
];

async function seedRestaurants() {
  for (const restaurant of restaurants) {
    await pool.query(
      `INSERT INTO restaurants (name, slug, cuisine, price_level, address, city, postal_code,
         country_code, latitude, longitude, is_active)
       VALUES ($1, $2, $3, $4, $5, 'København', $6, 'DK', $7, $8, true)
       ON CONFLICT (slug) DO UPDATE
         SET name = EXCLUDED.name,
             cuisine = EXCLUDED.cuisine,
             price_level = EXCLUDED.price_level,
             address = EXCLUDED.address,
             postal_code = EXCLUDED.postal_code,
             latitude = EXCLUDED.latitude,
             longitude = EXCLUDED.longitude,
             is_active = true,
             updated_at = now()`,
      [
        restaurant.name,
        restaurant.slug,
        restaurant.cuisine,
        restaurant.priceLevel,
        restaurant.address,
        restaurant.postalCode,
        restaurant.latitude,
        restaurant.longitude,
      ],
    );
  }

  console.log(`seeded ${restaurants.length} demo restaurants`);
}

try {
  await seedRestaurants();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await pool.end();
}
