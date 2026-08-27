import { Plus } from "lucide-react";
import Button from "../../Button/Button";
import "./DishCard.scss";

type DishCardProps = {
  image: string;
  name: string;
  description: string;
  price: number;
  currency?: string;
  onAdd?: () => void;
};

function DishCard({
  image,
  name,
  description,
  price,
  currency = "DKK",
  onAdd,
}: DishCardProps) {
  return (
    <article className="dish-card">
      <img
        className="dish-card__image"
        src={image}
        alt={name}
      />

      <div className="dish-card__content">
        <div className="dish-card__info">
          <h3 className="dish-card__name">{name}</h3>

          <p className="dish-card__description">
            {description}
          </p>
        </div>

        <div className="dish-card__footer">
          <span className="dish-card__price">
            {price} {currency}
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
  );
}

export default DishCard;