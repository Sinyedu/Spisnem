import { ChevronRight, Clock3, Heart, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../components/common/EmptyState/EmptyState";
import LanguageSwitcher from "../../components/common/LanguageSwitcher/LanguageSwitcher";
import TabPage from "../../components/common/TabPage/TabPage";
import { useCustomerSession } from "../../session/customerSessionContext";
import "./Profile.scss";

const ICON_SIZE = 20;

const LINKS = [
  { to: "/history", labelKey: "profile.history", icon: Clock3 },
  { to: "/favourites", labelKey: "profile.favourites", icon: Heart },
] as const;

function SignedInProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, signOut } = useCustomerSession();
  return (
    <>
      <section className="profile__card">
        <span className="profile__avatar" aria-hidden>{user?.name.charAt(0).toUpperCase()}</span>
        <span>
          <span className="profile__name">{user?.name}</span>
          <span className="profile__email">{user?.email}</span>
        </span>
      </section>
      <ul className="profile__links">
        {LINKS.map(({ to, labelKey, icon: Icon }) => (
          <li key={to}>
            <Link className="profile__link" to={to}>
              <Icon size={ICON_SIZE} aria-hidden /> <span>{t(labelKey)}</span> <ChevronRight size={ICON_SIZE} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
      <button type="button" className="profile__sign-out" onClick={() => void signOut().then(() => navigate("/map"))}>
        {t("profile.signOut")}
      </button>
    </>
  );
}

/** Who you are, your visits and favourites, and the app language. */
function Profile() {
  const { t } = useTranslation();
  const { user, loading } = useCustomerSession();

  return (
    <TabPage title={t("profile.title")} className="profile">
      {!loading && user && <SignedInProfile />}
      {!loading && !user && (
        <EmptyState icon={UserRound} title={t("profile.signedOutTitle")} body={t("profile.signedOutBody")}
          actionLabel={t("profile.signIn")} actionTo="/signin" />
      )}
      <LanguageSwitcher className="profile__language" />
    </TabPage>
  );
}

export default Profile;
