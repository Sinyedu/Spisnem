import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useFavourites } from "../../../hooks/useFavourites";
import type { FavouriteButtonProps } from "../../../types/generic";
import "./FavouriteButton.scss";

const ICON_SIZE = 20;

/** Round heart over the cover photo. Signed-out guests are sent to sign in first. */
function FavouriteButton({ restaurantId, className = "" }: FavouriteButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isFavourite, signedIn, toggle } = useFavourites();
  const saved = isFavourite(restaurantId);

  return (
    <button
      type="button"
      className={`favourite-button ${saved ? "favourite-button--saved" : ""} ${className}`}
      aria-pressed={saved}
      aria-label={t(saved ? "restaurant.removeFavourite" : "restaurant.addFavourite")}
      onClick={() => (signedIn ? void toggle(restaurantId) : navigate("/signin"))}
    >
      <Heart size={ICON_SIZE} aria-hidden />
    </button>
  );
}

export default FavouriteButton;
