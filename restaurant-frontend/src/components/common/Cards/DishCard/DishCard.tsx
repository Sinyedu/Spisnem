import { Plus } from "lucide-react";
import Button from "../../Button/Button";
import type { Dish } from "./Dish.types";
import "./DishCard.scss";

type DishCardProps = {
  dish: Dish;
  onAdd?: () => void;
};

function DishCard({ dish, onAdd }: DishCardProps) {
  const {
    image,
    name,
    description,
    priceMinor,
    currency = "DKK",
  } = dish;

  const formattedPrice = new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency,
  }).format(priceMinor / 100);

  return (
    <section className="dish">
      <article className="dish-card">
        {image && (
          <img
            className="dish-card__image"
            src={image}
            alt={name}
          />
        )}

        <div className="dish-card__content">
          <div className="dish-card__info">
            <h3 className="dish-card__name">{name}</h3>

            {description && (
              <p className="dish-card__description">
                {description}
              </p>
            )}
          </div>

          <div className="dish-card__footer">
            <span className="dish-card__price">
              {formattedPrice}
            </span>

            <Button
              variant="primary"
              size="medium"
              fullWidth={false}
              onClick={onAdd}
            >
              <Plus size={18} />
              Add to order
            </Button>
          </div>
        </div>
      </article>
    </section>
  );
}

export default DishCard;