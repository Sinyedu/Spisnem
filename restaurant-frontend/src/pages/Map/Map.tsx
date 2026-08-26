import { useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import BottomSheet from "../../components/map/BottomSheet/BottomSheet";
import MapSearchBar from "../../components/map/MapSearchBar/MapSearchBar";
import RestaurantList from "../../components/map/RestaurantList/RestaurantList";
import SideMenu from "../../components/map/SideMenu/SideMenu";
import MapLoadingOverlay from "./MapLoadingOverlay";
import { useRestaurantMap } from "./useRestaurantMap";
import "./Map.scss";

function Map() {
  const { container, restaurants, selectedId, searchTerm, search, failed, mapReady } = useRestaurantMap();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="map">
      <div className="map__canvas" ref={container} />
      {!mapReady && <MapLoadingOverlay />}

      <MapSearchBar value={searchTerm} onChange={search} onOpenMenu={() => setMenuOpen(true)} />

      <BottomSheet>
        <RestaurantList
          restaurants={restaurants}
          selectedId={selectedId}
          searchTerm={searchTerm}
          failed={failed}
        />
      </BottomSheet>

      <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </main>
  );
}

export default Map;
