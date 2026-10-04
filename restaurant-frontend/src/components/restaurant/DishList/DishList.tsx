import { useTranslation } from "react-i18next";
import { formatPrice } from "../../../lib/menu";
import type { DishListProps } from "../../../types/generic";
import "./DishList.scss";

/** Compact rows of dishes: photo, name, description and price. Used for the menu preview. */
function DishList({ items }: DishListProps) {
  const { i18n } = useTranslation();

  return (
    <ul className="dish-list">
      {items.map((item) => (
        <li key={item.id} className="dish-list__item">
          {item.imageUrl && <img className="dish-list__image" src={item.imageUrl} alt="" loading="lazy" />}
          <span className="dish-list__text">
            <span className="dish-list__name">{item.name}</span>
            {item.description && <span className="dish-list__description">{item.description}</span>}
          </span>
          <span className="dish-list__price tabular">{formatPrice(item.priceMinor, item.currency, i18n.language)}</span>
        </li>
      ))}
    </ul>
  );
}

export default DishList;
