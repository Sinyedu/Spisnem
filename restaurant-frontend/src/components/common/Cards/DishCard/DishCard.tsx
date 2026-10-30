import { Plus } from "lucide-react";
import Button from "../../Button/Button";
import type { DishCardFooterProps, DishCardProps } from "./Dish.types";
import "./DishCard.scss";

const MINOR_UNITS = 100;

function DishCardFooter({ priceMinor, currency, onAdd }: DishCardFooterProps) {
  const formattedPrice = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
  }).format(priceMinor / MINOR_UNITS);

  return (
    <div className="dish-card__footer">
      <span className="dish-card__price">{formattedPrice}</span>

      {/* Ordering comes with the full app; without an onAdd the card only shows the price. */}
      {onAdd && (
        <Button variant="primary" size="medium" fullWidth={false} onClick={onAdd}>
          <Plus size={18} />
          Add to order
        </Button>
      )}
    </div>
  );
}

function DishCard({ image, name, description, priceMinor, currency = "DKK", onAdd }: DishCardProps) {
  return (
    <section className="dish">
      <article className="dish-card">
        {image && <img className="dish-card__image" src={image} alt={name} />}

        <div className="dish-card__content">
          <div className="dish-card__info">
            <h3 className="dish-card__name">{name}</h3>
            {description && <p className="dish-card__description">{description}</p>}
          </div>

          <DishCardFooter priceMinor={priceMinor} currency={currency} onAdd={onAdd} />
        </div>
      </article>
    </section>
  );
}

export default DishCard;
