import { Clock, Users, Wallet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import DishCard from "../../components/common/Cards/DishCard/DishCard";
import InfoCard from "../../components/common/Cards/InfoCards/InfoCard";
import NavBar from "../../components/common/Nav/NavBar";
import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../lib/restaurants";
import { estimateWait, priceLabel } from "../../lib/wait";
import type { MenuSectionProps, MenuSectionsProps, RestaurantViewProps } from "../../types/generic";
import { useRestaurantMenu } from "./useRestaurantMenu";
import "./Menu.scss";

const INFO_ICON_SIZE = 14;

function MenuSection({ title, items }: MenuSectionProps) {
  if (items.length === 0) return null;
  return (
    <section className="menu__section">
      <h2 className="menu__section-title">{title}</h2>
      {items.map((item) => (
        <DishCard key={item.id} image={item.imageUrl} name={item.name} description={item.description}
          priceMinor={item.priceMinor} currency={item.currency} />
      ))}
    </section>
  );
}

function RestaurantInfo({ restaurant }: RestaurantViewProps) {
  const { t } = useTranslation();
  const wait = estimateWait(restaurant);
  return (
    <div className="menu__restaurant-info">
      <InfoCard icon={<Clock size={INFO_ICON_SIZE} />} label={t("menu.waitLabel")}
        value={wait.open ? t("wait.minutes", { minutes: wait.minutes }) : t(`wait.${wait.state}`)} />
      <InfoCard icon={<Users size={INFO_ICON_SIZE} />} label={t("menu.queueLabel")}
        value={t("menu.ahead", { count: restaurant.partiesWaiting })} />
      <InfoCard icon={<Wallet size={INFO_ICON_SIZE} />} label={t("menu.priceLabel")} value={priceLabel(restaurant.priceLevel) ?? "–"} />
    </div>
  );
}

function MenuSections({ menu }: MenuSectionsProps) {
  const { t } = useTranslation();
  const hasDishes = menu.categories.some((category) => category.items.length > 0) || menu.uncategorized.length > 0;
  if (!hasDishes) return <p className="menu__status">{t("menu.empty")}</p>;
  return (
    <>
      <MenuSection title={t("menu.featured")} items={menu.featured} />
      {menu.categories.map((category) => <MenuSection key={category.id} title={category.name} items={category.items} />)}
      <MenuSection title={t("menu.other")} items={menu.uncategorized} />
    </>
  );
}

/** A restaurant's full menu, browsable before or while waiting. Ordering arrives with the full app. */
function Menu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { slug = "" } = useParams();
  const { restaurant, menu, failed } = useRestaurantMenu(slug);

  return (
    <main className="menu">
      <section className="menu-hero">
        <img src={restaurant?.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE} alt="" />
        <NavBar restaurantId={restaurant?.id} title={restaurant?.name} />
      </section>
      <div className="menu__content">
        {failed && <p className="menu__status">{t("menu.loadFailed")}</p>}
        {restaurant && (
          <header className="menu__restaurant">
            <h1 className="menu__restaurant-name">{restaurant.name}</h1>
            <p className="menu__restaurant-type">{[restaurant.cuisine, restaurant.city].filter(Boolean).join(" · ")}</p>
            <RestaurantInfo restaurant={restaurant} />
          </header>
        )}
        {menu && <MenuSections menu={menu} />}
      </div>
      {restaurant?.queueEnabled && (
        <footer className="menu__footer">
          <button type="button" className="menu__cta" onClick={() => navigate(`/restaurants/${slug}/queue`)}>
            {t("restaurant.joinQueue")}
          </button>
        </footer>
      )}
    </main>
  );
}

export default Menu;
