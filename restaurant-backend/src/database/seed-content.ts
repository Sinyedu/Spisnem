// The same seed content the Postgres seeds used, moved here unchanged.

export const SPISNEM_CATEGORIES = [
  { name: "Pizza", sortOrder: 1 },
  { name: "Main dishes", sortOrder: 2 },
  { name: "Drinks", sortOrder: 3 },
];

export const SPISNEM_ITEMS = [
  { category: "Pizza", name: "Margherita", description: "Tomato, mozzarella, basil", priceMinor: 8900, featured: true },
  { category: "Pizza", name: "Pepperoni", description: "Tomato, mozzarella, pepperoni", priceMinor: 9900, featured: false },
  { category: "Pizza", name: "Vegetariana", description: "Seasonal vegetables", priceMinor: 9500, featured: false },
  { category: "Main dishes", name: "Burger and fries", description: "Beef patty, cheddar, house sauce", priceMinor: 12900, featured: true },
  { category: "Main dishes", name: "Grilled salmon", description: "Salmon, potatoes, dill", priceMinor: 16500, featured: false },
  { category: "Main dishes", name: "Caesar salad", description: "Romaine, parmesan, croutons", priceMinor: 8500, featured: false },
  { category: "Drinks", name: "Sparkling water", description: "50 cl", priceMinor: 2500, featured: false },
  { category: "Drinks", name: "Draft beer", description: "40 cl", priceMinor: 4500, featured: false },
  { category: "Drinks", name: "House lemonade", description: "Lemon and mint", priceMinor: 3500, featured: false },
];

// Demo data for the map. These are invented venues, not real businesses.
export const DEMO_RESTAURANTS = [
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
