import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/common/BackButton/BackButton";
import FavouriteButton from "../../components/restaurant/FavouriteButton/FavouriteButton";
import MenuPreview from "../../components/restaurant/MenuPreview/MenuPreview";
import QueueSummary from "../../components/restaurant/QueueSummary/QueueSummary";
import RestaurantDetails from "../../components/restaurant/RestaurantDetails/RestaurantDetails";
import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../lib/restaurants";
import { priceLabel } from "../../lib/wait";
import type { RestaurantViewProps } from "../../types/generic";
import { useRestaurant } from "./useRestaurant";
import "./Restaurant.scss";

function RestaurantBody({ restaurant }: RestaurantViewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const meta = [restaurant.cuisine, priceLabel(restaurant.priceLevel), restaurant.city].filter(Boolean).join(" · ");

  return (
    <>
      <div className="restaurant__body">
        <header>
          <h1 className="restaurant__name">{restaurant.name}</h1>
          {meta && <p className="restaurant__meta">{meta}</p>}
        </header>
        <QueueSummary restaurant={restaurant} />
        <MenuPreview restaurant={restaurant} />
        <RestaurantDetails restaurant={restaurant} />
      </div>
      <footer className="restaurant__footer">
        <button
          type="button"
          className="restaurant__cta"
          disabled={!restaurant.queueEnabled}
          onClick={() => navigate(`/restaurants/${restaurant.slug}/queue`)}
        >
          {t("restaurant.joinQueue")}
        </button>
      </footer>
    </>
  );
}

function Restaurant() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const { restaurant, failed } = useRestaurant(slug);

  return (
    <main className="restaurant">
      <header className="restaurant__cover">
        <img src={restaurant?.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE} alt="" />
        <BackButton className="restaurant__back" label={t("restaurant.back")} />
        {restaurant && <FavouriteButton className="restaurant__favourite" restaurantId={restaurant.id} />}
      </header>
      {failed && <p className="restaurant__status">{t("restaurant.loadFailed")}</p>}
      {!failed && !restaurant && <p className="restaurant__status">{t("restaurant.loading")}</p>}
      {restaurant && <RestaurantBody restaurant={restaurant} />}
    </main>
  );
}

export default Restaurant;
