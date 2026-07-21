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
};

export type RestaurantSummary = {
  id: string;
  name: string;
  slug: string;
};
