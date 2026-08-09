import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RESTAURANT_PLACEHOLDER_IMAGE, getRestaurant } from "../../lib/restaurants";
import type { Restaurant as RestaurantType } from "../../types/api";
import "./Restaurant.scss";

// Each becomes a real section as menus and queueing land.
const SECTIONS = [
  { title: "Menu", body: "Dishes and prices appear here once the menu is connected." },
  { title: "Opening hours", body: "Opening hours are not part of the restaurant record yet." },
  { title: "Queue", body: "Join the queue and watch your place update live." },
];

function Restaurant() {
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
        <button className="restaurant__back" onClick={() => navigate(-1)} aria-label="Go back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </header>

      {failed ?
        <p className="restaurant__empty">Could not load this restaurant.</p>
      : <div className="restaurant__body">
          <h1 className="restaurant__name">{restaurant?.name ?? "Loading…"}</h1>

          <p className="restaurant__meta">
            {[
              restaurant?.cuisine,
              restaurant?.priceLevel ? "$".repeat(restaurant.priceLevel) : null,
              restaurant?.queueEnabled ? `~${restaurant.averageWaitMinutes} min wait` : null,
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

          <button className="restaurant__cta" onClick={() => navigate("/queue")}>
            Join the queue
          </button>

          {SECTIONS.map((section) => (
            <section key={section.title} className="restaurant__section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      }
    </main>
  );
}

export default Restaurant;
