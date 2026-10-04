import { forwardRef } from "react";
import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../../lib/restaurants";
import { priceLabel } from "../../../lib/wait";
import type { RestaurantCardProps } from "../../../types/generic";
import WaitChip from "../../common/WaitChip/WaitChip";
import "./RestaurantCard.scss";

/** One row in the "Nearby" list: photo, name, cuisine · price, and the wait. */
const RestaurantCard = forwardRef<HTMLButtonElement, RestaurantCardProps>(
  function RestaurantCard({ restaurant, selected, onOpen }, ref) {
    const meta = [restaurant.cuisine, priceLabel(restaurant.priceLevel)].filter(Boolean).join(" · ");

    return (
      <button
        ref={ref}
        type="button"
        aria-current={selected || undefined}
        className={`restaurant-card ${selected ? "restaurant-card--selected" : ""}`}
        onClick={() => onOpen(restaurant.slug)}
      >
        <img
          className="restaurant-card__image"
          src={restaurant.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE}
          alt=""
          loading="lazy"
        />
        <span className="restaurant-card__text">
          <span className="restaurant-card__name">{restaurant.name}</span>
          {meta && <span className="restaurant-card__meta">{meta}</span>}
          <WaitChip source={restaurant} />
        </span>
      </button>
    );
  },
);

export default RestaurantCard;
