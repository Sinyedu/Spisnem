import type { MapRestaurant } from "./api";

export type MapSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onOpenMenu: () => void;
};
export type RestaurantListProps = {
  restaurants: MapRestaurant[];
  // Set by tapping a pin, so the matching row is highlighted.
  selectedId: string | null;
  searchTerm: string;
  failed: boolean;
};

export type SideMenuProps = {
  open: boolean;
  onClose: () => void;
};
