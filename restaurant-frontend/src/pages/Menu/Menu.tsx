// import { useMemo } from "react";
import { Clock, Star, Users } from "lucide-react";
import heroImage from "../../assets/images/restaurants/mad-og-kaffe.jpg";
import DishCard from "../../components/common/Cards/DishCard/DishCard";
import InfoCard from "../../components/common/Cards/InfoCards/InfoCard";
import NavBar from "../../components/common/Nav/NavBar";
import dishes from "../../data/dishes.json";
import "./Menu.scss";

// function getRestaurantDishes<T>(items: T[], restaurantId: number, count = 20) {
//   const startIndex = (restaurantId * 17) % items.length;

//   return Array.from({ length: count }, (_, index) => {
//     return items[(startIndex + index * 7) % items.length];
//   });
// }

function getRestaurantDishes<T>(
  items: T[],
  restaurantId: string,
  count = 20
) {
  const seed = restaurantId
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  const startIndex = seed % items.length;

  return Array.from({ length: count }, (_, index) => {
    return items[(startIndex + index * 7) % items.length];
  });
}

function Menu() {
  const restaurantId = "550e8400-e29b-41d4-a716-446655440000";

  const restaurantDishes = getRestaurantDishes(
    dishes,
    restaurantId,
    20
  );


  return (
    <main className="menu">
      <section className="menu-hero">
        <img src={heroImage} alt="Mad & Kaffe restaurant" />

        <NavBar />
      </section>

      <div className="menu__content">
        <section className="menu__restaurant">
          <div className="menu__restaurant-name">
            Mad & Kaffe
          </div>

          <div className="menu__restaurant-type">
            Brunch & breakfast * Vesterbro, Copenhagen
          </div>

          <div className="menu__restaurant-info">
            <InfoCard
              icon={<Star size={14} fill="#c1392b" stroke="false" />}
              value="4.3"
              label="Rating"
            />

            <InfoCard
              icon={<Clock size={14} />}
              value="~10 min"
              label="Est. wait"
            />

            <InfoCard
              icon={<Users size={14} fill="#c1392b" stroke="false" />}
              value="3 ahead"
              label="In queue"
            />
          </div>
        </section>

        {/* Should be made so the restaurants can add them to their menus themselves - CMS style */}
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