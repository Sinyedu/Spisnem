import { ArrowLeft, Share2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { NavBarProps } from "../../../types/generic";
import FavouriteButton from "../../restaurant/FavouriteButton/FavouriteButton";
import "./NavBar.scss";

// Uses the phone's own share sheet when there is one, otherwise copies the link.
async function shareCurrentPage(title: string) {
  const url = window.location.href;
  if (navigator.share) await navigator.share({ title, url }).catch(() => undefined);
  else await navigator.clipboard?.writeText(url);
}

function NavBar({ restaurantId, title = "" }: NavBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <nav className="hero-nav" aria-label={t("menu.navLabel")}>
      <button className="hero-nav__button" aria-label={t("restaurant.back")} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
      </button>

      <div className="hero-nav__actions">
        {restaurantId && <FavouriteButton restaurantId={restaurantId} />}
        <button className="hero-nav__button" aria-label={t("menu.share")} onClick={() => void shareCurrentPage(title)}>
          <Share2 size={20} />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
