export type Restaurant = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  postalCode: string | null;
  countryCode: string;
  heroImageUrl: string | null;
  queueEnabled: boolean;
  averageWaitMinutes: number;
  currency: string;
  latitude: number | null;
  longitude: number | null;
  rating: number | null;
};

// Public detail response: a restaurant plus its current live queue snapshot.
export type RestaurantDetail = Restaurant & {
  queueLength: number;
  estimatedWaitMinutes: number;
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
};
