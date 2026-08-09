import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../../lib/restaurants";
import type { MapRestaurant } from "../../../types/api";
import "./RestaurantList.scss";

type RestaurantListProps = {
  restaurants: MapRestaurant[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

function RestaurantList({ restaurants, selectedId, onSelect }: RestaurantListProps) {
  return (
    <section className="restaurants">
      <h2 className="restaurants__heading">Nearby</h2>

      {restaurants.length === 0 ?
        <p className="restaurants__empty">No restaurants in this area yet.</p>
      : <ul className="restaurants__list">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <button
                type="button"
                className={`restaurants__item ${restaurant.id === selectedId ? "restaurants__item--selected" : ""}`}
                onClick={() => onSelect(restaurant.id)}
              >
                <img
                  className="restaurants__image"
                  src={restaurant.coverImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE}
                  alt=""
                />
                <span className="restaurants__text">
                  <span className="restaurants__name">{restaurant.name}</span>
                  <span className="restaurants__meta">
                    {[restaurant.cuisine, restaurant.priceLevel && "$".repeat(restaurant.priceLevel)]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      }
    </section>
  );
}

export default RestaurantList;
