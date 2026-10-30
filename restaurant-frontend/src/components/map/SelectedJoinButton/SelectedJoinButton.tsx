import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { estimateWait } from "../../../lib/wait";
import type { SelectedJoinButtonProps } from "../../../types/generic";
import "./SelectedJoinButton.scss";

/** "Join queue · 10 min" for the pin the guest tapped. Hidden until a pin is chosen. */
function SelectedJoinButton({ restaurant }: SelectedJoinButtonProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  if (!restaurant) return null;

  const wait = estimateWait(restaurant);
  const label = wait.open ?
      t("map.joinSelected", { name: restaurant.name, minutes: wait.minutes })
    : t("map.selectedClosed", { name: restaurant.name });

  return (
    <button
      type="button"
      className="selected-join"
      disabled={!wait.open}
      onClick={() => navigate(`/restaurants/${restaurant.slug}/queue`)}
    >
      {label}
    </button>
  );
}

export default SelectedJoinButton;
