import { Heart } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import TabPage from "../../components/common/TabPage/TabPage";
import { useFavourites } from "../../hooks/useFavourites";
import { RESTAURANT_PLACEHOLDER_IMAGE } from "../../lib/restaurants";
import { useCustomerSession } from "../../session/customerSessionContext";
import type { FavouriteRowProps } from "../../types/generic";
import "./Favourites.scss";

function FavouriteRow({ favourite }: FavouriteRowProps) {
  return (
    <li>
      <Link className="favourites__row" to={`/restaurants/${favourite.slug}`}>
        <img className="favourites__image" src={favourite.heroImageUrl ?? RESTAURANT_PLACEHOLDER_IMAGE} alt="" loading="lazy" />
        <span>
          <span className="favourites__name">{favourite.name}</span>
          {favourite.cuisine && <span className="favourites__meta">{favourite.cuisine}</span>}
        </span>
      </Link>
    </li>
  );
}

function FavouritesContent() {
  const { t } = useTranslation();
  const { favourites, loading, failed } = useFavourites();
  if (loading) return <p className="favourites__status">{t("restaurant.loading")}</p>;
  if (failed) return <p className="favourites__status">{t("favourites.loadFailed")}</p>;
  if (favourites.length === 0) {
    return <EmptyState icon={Heart} title={t("favourites.emptyTitle")} body={t("favourites.emptyBody")}
      actionLabel={t("queue.exploreMap")} actionTo="/map" />;
  }
  return <ul className="favourites__list">{favourites.map((favourite) => <FavouriteRow key={favourite.id} favourite={favourite} />)}</ul>;
}

/** Restaurants the guest saved with the heart. Needs a signed-in guest. */
function Favourites() {
  const { t } = useTranslation();
  const { user, loading } = useCustomerSession();

  return (
    <TabPage title={t("favourites.title")}>
      {!loading && !user && (
        <EmptyState icon={Heart} title={t("favourites.signedOutTitle")} body={t("favourites.signedOutBody")}
          actionLabel={t("profile.signIn")} actionTo="/signin" />
      )}
      {user && <FavouritesContent />}
    </TabPage>
  );
}

export default Favourites;
