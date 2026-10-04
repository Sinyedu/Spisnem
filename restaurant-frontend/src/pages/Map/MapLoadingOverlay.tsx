const MAP_ICON = "/logo/iconFromLogo.svg";

function MapLoadingOverlay() {
  return (
    <div className="map-loading" role="status" aria-label="Loading map">
      <img className="map-loading__icon" src={MAP_ICON} alt="" aria-hidden />
    </div>
  );
}

export default MapLoadingOverlay;
