import { useNavigate } from "react-router-dom";
import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../../lib/restaurants";
import "./RestaurantList.scss";
import type { RestaurantListProps } from "../../../types/generic";

function emptyMessage(searchTerm: string, failed: boolean) {
  if (failed) return "Could not reach the server. Is the backend running?";
  if (searchTerm) return `No restaurants match “${searchTerm}”.`;
  return "No restaurants in this area yet.";
}

function RestaurantList({ restaurants, selectedId, searchTerm, failed }: RestaurantListProps) {
  const navigate = useNavigate();

  return (
    <section className="restaurants">
      <h2 className="restaurants__heading">
        Nearby
        {restaurants.length > 0 && <span> · {restaurants.length}</span>}
      </h2>

      {restaurants.length === 0 ?
        <p className="restaurants__empty">{emptyMessage(searchTerm, failed)}</p>
      : <ul className="restaurants__list">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id}>
              <button
                type="button"
                className={`restaurants__item ${restaurant.id === selectedId ? "restaurants__item--selected" : ""}`}
                onClick={() => navigate(`/restaurants/${restaurant.slug}`)}
              >
                <img
                  className="restaurants__image"
                  src={restaurant.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE}
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
