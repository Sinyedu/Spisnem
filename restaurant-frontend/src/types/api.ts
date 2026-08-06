// Single source for backend API response shapes.
// Mirrors restaurant-backend/src/types — keep in sync as endpoints are consumed.

export type Summary = {
  restaurants: number;
  openNow: number;
};
