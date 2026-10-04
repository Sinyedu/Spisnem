import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import BottomNav from "../../components/common/BottomNav/BottomNav";
import BottomSheet from "../../components/map/BottomSheet/BottomSheet";
import MapFilters from "../../components/map/MapFilters/MapFilters";
import MapSearchBar from "../../components/map/MapSearchBar/MapSearchBar";
import RestaurantList from "../../components/map/RestaurantList/RestaurantList";
import SelectedJoinButton from "../../components/map/SelectedJoinButton/SelectedJoinButton";
import SideMenu from "../../components/map/SideMenu/SideMenu";
import MapLoadingOverlay from "./MapLoadingOverlay";
import { useRestaurantMap } from "./useRestaurantMap";
import "./Map.scss";

function Map() {
  const { containerRef, mapReady, restaurants, selectedId, searchTerm, search, filterId, filter, failed } =
    useRestaurantMap();
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = restaurants.find((restaurant) => restaurant.id === selectedId);

  return (
    <main className="map">
      <div className="map__canvas" ref={containerRef} />
      {!mapReady && <MapLoadingOverlay />}

      <header className="map__top">
        <MapSearchBar value={searchTerm} onChange={search} onOpenMenu={() => setMenuOpen(true)} />
        <MapFilters value={filterId} onChange={filter} />
      </header>

      <BottomSheet expandKey={selectedId} footer={selected && <SelectedJoinButton restaurant={selected} />}>
        <RestaurantList restaurants={restaurants} selectedId={selectedId} searchTerm={searchTerm} failed={failed} />
      </BottomSheet>

      <BottomNav />
      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
}

export default Map;
