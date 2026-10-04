import { useTranslation } from "react-i18next";
import type { RestaurantViewProps } from "../../../types/generic";
import "./RestaurantDetails.scss";

function fullAddress({ restaurant }: RestaurantViewProps) {
  return [restaurant.address, restaurant.postalCode, restaurant.city].filter(Boolean).join(", ");
}

/** Address and phone rows, plus the restaurant's own description. */
function RestaurantDetails({ restaurant }: RestaurantViewProps) {
  const { t } = useTranslation();
  const address = fullAddress({ restaurant });

  return (
    <>
      {(address || restaurant.phone) && (
        <dl className="restaurant-details">
          {address && (
            <div className="restaurant-details__row">
              <dt>{t("restaurant.address")}</dt>
              <dd>{address}</dd>
            </div>
          )}
          {restaurant.phone && (
            <div className="restaurant-details__row">
              <dt>{t("restaurant.phone")}</dt>
              <dd><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></dd>
            </div>
          )}
        </dl>
      )}
      {restaurant.description && <p className="restaurant-details__description">{restaurant.description}</p>}
    </>
  );
}

export default RestaurantDetails;
