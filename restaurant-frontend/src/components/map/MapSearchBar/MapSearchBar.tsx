import "./MapSearchBar.scss";
import type { MapSearchBarProps } from "../../../types/generic";

/** Floating menu button and search field overlaid on the map. */
function MapSearchBar({ value, onChange, onOpenMenu }: MapSearchBarProps) {
  return (
    <header className="map-search">
      <button className="map-search__menu" onClick={onOpenMenu} aria-label="Open menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <form className="map-search__field" onSubmit={(event) => event.preventDefault()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>

        <input
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search name or cuisine"
          aria-label="Search restaurants"
        />

        {value && (
          <button type="button" onClick={() => onChange("")} aria-label="Clear search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        )}
      </form>
    </header>
  );
}

export default MapSearchBar;
