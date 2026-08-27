import { Clock, Star, Users } from "lucide-react";
import heroImage from "../../assets/images/restaurants/mad-og-kaffe.jpg";
import DishCard from "../../components/common/Cards/DishCard/DishCard";
import InfoCard from "../../components/common/Cards/InfoCards/InfoCard";
import NavBar from "../../components/common/Nav/NavBar";
import "./Menu.scss";

function Menu() {
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
          <DishCard
            image="*"
            name="Hawaiian Pizza"
            description="Tomato base, mozzarella, ham, pineapple. A polarising classic."
            price={89}
            onAdd={() => console.log("Added Hawaiian Pizza")}
          />
        </section>
      </div>
    </main>
  );
}

export default Menu;