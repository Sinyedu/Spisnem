import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RESTAURANT_PLACEHOLDER_IMAGE, getRestaurant } from "../../lib/restaurants";
import type { Restaurant as RestaurantType } from "../../types/api";
import "./Restaurant.scss";

// Each becomes a real section as menus and queueing land.
const SECTIONS = ["menu", "hours", "queue"] as const;

function Restaurant() {
  const { t } = useTranslation();
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getRestaurant(slug, controller.signal)
      .then(setRestaurant)
      .catch((error) => {
        if (!controller.signal.aborted) setFailed(true);
        if (!controller.signal.aborted) console.error("[restaurant]", error);
      });

    return () => controller.abort();
  }, [slug]);

  return (
    <main className="restaurant">
      <header className="restaurant__cover">
        <img src={restaurant?.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE} alt="" />
        <button className="restaurant__back" onClick={() => navigate(-1)} aria-label={t("restaurant.back")}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </header>

      {failed ?
        <p className="restaurant__empty">{t("restaurant.loadFailed")}</p>
      : <div className="restaurant__body">
          <h1 className="restaurant__name">{restaurant?.name ?? t("restaurant.loading")}</h1>

          <p className="restaurant__meta">
            {[
              restaurant?.cuisine,
              restaurant?.priceLevel ? "$".repeat(restaurant.priceLevel) : null,
              restaurant?.queueEnabled ?
                t("restaurant.waitMinutes", { minutes: restaurant.averageWaitMinutes })
              : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {restaurant?.address && (
            <p className="restaurant__address">
              {[restaurant.address, restaurant.postalCode, restaurant.city].filter(Boolean).join(", ")}
            </p>
          )}

          {restaurant?.description && <p className="restaurant__description">{restaurant.description}</p>}

          <button className="restaurant__cta" onClick={() => navigate(`/restaurants/${slug}/queue`)}>
            {t("restaurant.joinQueue")}
          </button>

          {SECTIONS.map((section) => (
            <section key={section} className="restaurant__section">
              <h2>{t(`restaurant.sections.${section}.title`)}</h2>
              <p>{t(`restaurant.sections.${section}.body`)}</p>
            </section>
          ))}
        </div>
      }
    </main>
  );
}

export default Restaurant;
