import { Compass, Heart, ListOrdered, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";
import { useCurrentQueueEntry } from "../../../session/queueEntryContext";
import type { BottomNavTab } from "../../../types/generic";
import "./BottomNav.scss";

const ICON_SIZE = 22;

const TABS: BottomNavTab[] = [
  { to: "/map", labelKey: "nav.discover", icon: Compass },
  { to: "/queue", labelKey: "nav.myQueue", icon: ListOrdered },
  { to: "/favourites", labelKey: "nav.favourites", icon: Heart },
  { to: "/profile", labelKey: "nav.profile", icon: UserRound },
];

// "#3" on the My queue tab while the guest is in line, "!" once they are called.
function useQueueBadge() {
  const { entry } = useCurrentQueueEntry();
  if (entry?.status === "notified") return "!";
  if (entry?.status === "waiting" && entry.position) return `#${entry.position}`;
  return null;
}

/** The app's main tabs. Sits at the bottom of Discover, My queue, Favourites and Profile. */
function BottomNav() {
  const { t } = useTranslation();
  const badge = useQueueBadge();

  return (
    <nav className="bottom-nav" aria-label={t("nav.label")}>
      {TABS.map(({ to, labelKey, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bottom-nav__tab ${isActive ? "bottom-nav__tab--active" : ""}`}>
          <span className="bottom-nav__icon">
            <Icon size={ICON_SIZE} aria-hidden />
            {to === "/queue" && badge && <span className="bottom-nav__badge tabular">{badge}</span>}
          </span>
          <span className="bottom-nav__label">{t(labelKey)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNav;
