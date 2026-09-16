import { Clock, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DishCard from "../../components/common/Cards/DishCard/DishCard";
import InfoCard from "../../components/common/Cards/InfoCards/InfoCard";
import NavBar from "../../components/common/Nav/NavBar";
import dishes from "../../data/dishes.json";
import { getRestaurantDishes } from "../../lib/menu";
import {
  RESTAURANT_PLACEHOLDER_IMAGE,
  getRestaurant,
} from "../../lib/restaurants";
import type { Restaurant as RestaurantType } from "../../types/api";

import "./Menu.scss";

function Menu() {
  const { slug = "" } = useParams();

  // Make line 21 - 39 into a hook file instead later
  const [restaurant, setRestaurant] =
    useState<RestaurantType | null>(null);

  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getRestaurant(slug, controller.signal)
      .then(setRestaurant)
      .catch((error) => {
        if (!controller.signal.aborted) {
          setFailed(true);
          console.error("[menu]", error);
        }
      });

    return () => controller.abort();
  }, [slug]);

  const restaurantDishes = restaurant
    ? getRestaurantDishes(dishes, restaurant.id, 20)
    : [];

  if (failed) {
    return (
      <main className="menu">
        <p>Failed to load restaurant.</p>
      </main>
    );
  }

  return (
    <main className="menu">
      <section className="menu-hero">
        <img
          src={
            restaurant?.heroImageUrl ??
            RESTAURANT_PLACEHOLDER_IMAGE
          }
          alt={restaurant ? `${restaurant.name} restaurant` : ""}
        />

        <NavBar />
      </section>

      <div className="menu__content">
        <section className="menu__restaurant">
          <div className="menu__restaurant-name">
            {restaurant?.name ?? "Loading..."}
          </div>

          <div className="menu__restaurant-type">
            {restaurant?.cuisine}
          </div>

          <div className="menu__restaurant-info">
            <InfoCard
              icon={
                <Star
                  size={14}
                  fill="#c1392b"
                  stroke="false"
                />
              }
              value="4.3"
              label="Rating"
            />

            <InfoCard
              icon={<Clock size={14} />}
              value="~10 min"
              label="Est. wait"
            />

            <InfoCard
              icon={
                <Users
                  size={14}
                  fill="#c1392b"
                  stroke="false"
                />
              }
              value="3 ahead"
              label="In queue"
            />
          </div>
        </section>

        <section className="menu__restaurant-dishes">
          <h2 className="menu__section-title">Menu</h2>

          {restaurantDishes.map((dish) => (
            <DishCard
              key={dish.id}
              image={dish.image}
              name={dish.name}
              description={dish.description}
              priceMinor={dish.priceMinor}
              onAdd={() => console.log(`Added ${dish.name}`)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

export default Menu;