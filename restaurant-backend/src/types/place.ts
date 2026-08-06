// A food place discovered from an external map/POI source (not a Spisnem tenant).
export type Place = {
  id: string; // e.g. "node/123456" — stable per OSM element
  name: string;
  latitude: number;
  longitude: number;
  category: string; // amenity: restaurant | cafe | bar | fast_food | pub | food_court
  cuisine: string | null;
  address: string | null;
};
