import { StarIcon } from "./icons";
import { formatRating } from "../lib/format";
import "./RatingBadge.scss";

type Props = {
  rating: number | null | undefined;
  variant?: "red" | "dark" | "light";
  size?: "sm" | "md";
};

export default function RatingBadge({ rating, variant = "light", size = "sm" }: Props) {
  return (
    <span className={`rating-badge rating-badge--${variant} rating-badge--${size}`}>
      <StarIcon size={size === "sm" ? 13 : 15} />
      {formatRating(rating)}
    </span>
  );
}
