import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useResource } from "../../../hooks/useResource";
import { getPublicMenu } from "../../../lib/menu";
import type { RestaurantViewProps } from "../../../types/generic";
import DishList from "../DishList/DishList";
import "./MenuPreview.scss";

// Enough to get hungry; the full menu is one tap away.
const PREVIEW_COUNT = 3;
const ICON_SIZE = 18;

/** A taste of the menu on the restaurant page: featured dishes first. */
function MenuPreview({ restaurant }: RestaurantViewProps) {
  const { t } = useTranslation();
  const { data: menu } = useResource(`menu:${restaurant.slug}`, (signal) => getPublicMenu(restaurant.slug, signal));
  if (!menu) return null;

  const allItems = [...menu.categories.flatMap((category) => category.items), ...menu.uncategorized];
  const preview = (menu.featured.length > 0 ? menu.featured : allItems).slice(0, PREVIEW_COUNT);
  if (preview.length === 0) return null;

  return (
    <section className="menu-preview">
      <header className="menu-preview__header">
        <h2 className="menu-preview__title">{t("restaurant.menuTitle")}</h2>
        <Link className="menu-preview__link" to={`/restaurants/${restaurant.slug}/menu`}>
          {t("restaurant.seeMenu", { count: allItems.length })} <ChevronRight size={ICON_SIZE} aria-hidden />
        </Link>
      </header>
      <DishList items={preview} />
    </section>
  );
}

export default MenuPreview;
