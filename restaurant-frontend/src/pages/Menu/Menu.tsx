import { CircleHelp, Clock, Star } from "lucide-react";
import InfoCard from "../../components/common/Cards/InfoCards/InfoCard";
import "./Menu.scss";

function Menu() {
  return (
    <main className="menu">
      <section className="menu-hero">
        <img src="*" alt="*" />
      </section>

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
            icon={<CircleHelp size={14} fill="#c1392b" stroke="false" />}
            value="3 ahead"
            label="In queue"
          />
        </div>
      </section>

      <section className="menu__restaurant-dishes">
        Menu Card Component
      </section>
    </main>
  );
}

export default Menu;