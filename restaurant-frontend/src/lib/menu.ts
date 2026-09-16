export function getRestaurantDishes<T>(
  items: T[],
  restaurantId: string,
  count = 20
) {
  const seed = restaurantId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const startIndex = seed % items.length;

  return Array.from({ length: count }, (_, index) => {
    return items[(startIndex + index * 7) % items.length];
  });
}