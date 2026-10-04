import { useTranslation } from "react-i18next";
import { MAP_FILTERS, SHORT_WAIT_MINUTES } from "../../../pages/Map/mapFilters";
import type { MapFiltersProps } from "../../../types/generic";
import "./MapFilters.scss";

/** Filter chips under the search bar. One is always active; "All" clears the rest. */
function MapFilters({ value, onChange }: MapFiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="map-filters" role="group" aria-label={t("map.filters.label")}>
      {MAP_FILTERS.map((filter) => (
        <button
          key={filter.id}
          type="button"
          aria-pressed={filter.id === value}
          className={`map-filters__chip ${filter.id === value ? "map-filters__chip--active" : ""}`}
          onClick={() => onChange(filter.id)}
        >
          {t(`map.filters.${filter.id}`, { minutes: SHORT_WAIT_MINUTES })}
        </button>
      ))}
    </div>
  );
}

export default MapFilters;
