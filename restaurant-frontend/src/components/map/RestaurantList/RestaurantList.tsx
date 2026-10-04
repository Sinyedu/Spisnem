import type { TFunction } from "i18next";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import RestaurantCard from "../RestaurantCard/RestaurantCard";
import "./RestaurantList.scss";
import type { RestaurantListProps } from "../../../types/generic";

function emptyMessage(t: TFunction, searchTerm: string, failed: boolean) {
  if (failed) return t("map.empty.failed");
  if (searchTerm) return t("map.empty.noMatches", { term: searchTerm });
  return t("map.empty.noneNearby");
}

// Tapping a pin brings its card into view, so the map and the list stay in step.
function useScrollToSelected(selectedId: string | null) {
  const cards = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    if (!selectedId) return;
    cards.current.get(selectedId)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);
  return (id: string) => (element: HTMLButtonElement | null) => {
    if (element) cards.current.set(id, element);
    else cards.current.delete(id);
  };
}

function RestaurantList({ restaurants, selectedId, searchTerm, failed }: RestaurantListProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const cardRef = useScrollToSelected(selectedId);

  return (
    <section className="restaurants">
      <header className="restaurants__header">
        <h2 className="restaurants__heading">
          {t("map.nearby")}
          {restaurants.length > 0 && <span className="restaurants__count"> · {restaurants.length}</span>}
        </h2>
        {restaurants.length > 1 && <span className="restaurants__sort">{t("map.sortedByWait")}</span>}
      </header>

      {restaurants.length === 0 ?
        <p className="restaurants__empty">{emptyMessage(t, searchTerm, failed)}</p>
      : <ul className="restaurants__list">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <RestaurantCard
                ref={cardRef(restaurant.id)}
                restaurant={restaurant}
                selected={restaurant.id === selectedId}
                onOpen={(slug) => navigate(`/restaurants/${slug}`)}
              />
            </li>
          ))}
        </ul>
      }
    </section>
  );
}

export default RestaurantList;
