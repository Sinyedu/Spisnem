import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import type { CustomerVisit, FavouriteRestaurant, MapRestaurant, Menu, MenuItem, Restaurant } from "./api";
import type { MapFilterId } from "./map";
import type { WaitSource } from "./wait";

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

export type MapFiltersProps = {
  value: MapFilterId;
  onChange: (id: MapFilterId) => void;
};

export type RestaurantCardProps = {
  restaurant: MapRestaurant;
  selected: boolean;
  onOpen: (slug: string) => void;
};

export type WaitChipProps = {
  source: WaitSource;
};

export type SelectedJoinButtonProps = {
  restaurant: MapRestaurant | undefined;
};

export type BottomSheetProps = {
  children: ReactNode;
  // Pinned under the scrolling list, e.g. the join button for the selected pin.
  footer?: ReactNode;
  // When this changes to a value, the sheet rises to at least half height.
  expandKey?: string | null;
};

export type BackButtonProps = {
  label: string;
  // Defaults to going one step back in history.
  onClick?: () => void;
  className?: string;
};

export type RestaurantViewProps = {
  restaurant: Restaurant;
};

export type BottomNavTab = {
  to: string;
  labelKey: "nav.discover" | "nav.myQueue" | "nav.favourites" | "nav.profile";
  icon: LucideIcon;
};

export type FavouriteButtonProps = {
  restaurantId: string;
  className?: string;
};

export type DishListProps = {
  items: MenuItem[];
};

export type NavBarProps = {
  // Shows the favourite heart for this restaurant.
  restaurantId?: string;
  // Used as the title when sharing the page.
  title?: string;
};

export type MenuSectionProps = {
  title: string;
  items: MenuItem[];
};

export type MenuSectionsProps = {
  menu: Menu;
};

export type TabPageProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  body: string;
  actionLabel?: string;
  actionTo?: string;
};

export type FavouriteRowProps = {
  favourite: FavouriteRestaurant;
};

export type VisitRowProps = {
  visit: CustomerVisit;
};
