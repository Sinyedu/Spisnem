import "maplibre-gl/dist/maplibre-gl.css";
import BottomSheet from "../../components/map/BottomSheet/BottomSheet";
import MapSearchBar from "../../components/map/MapSearchBar/MapSearchBar";
import RestaurantList from "../../components/map/RestaurantList/RestaurantList";
import { useRestaurantMap } from "./useRestaurantMap";
import "./Map.scss";

function Map() {
  const { container, restaurants, selectedId, selectRestaurant } = useRestaurantMap();

  return (
    <main className="map">
      <div className="map__canvas" ref={container} />

      <MapSearchBar />

      <BottomSheet>
        <RestaurantList
          restaurants={restaurants}
          selectedId={selectedId}
          onSelect={selectRestaurant}
        />
      </BottomSheet>
    </main>
  );
}

export default Map;
