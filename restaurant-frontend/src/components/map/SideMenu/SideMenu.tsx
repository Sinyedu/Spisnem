import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../common/LanguageSwitcher/LanguageSwitcher";
import "./SideMenu.scss";
import type { SideMenuProps } from "../../../types/generic";

const SECONDARY_LOGO = "/logo/secondary.svg";

const LINKS = [
  { labelKey: "sideMenu.exploreMap", to: "/map" },
  { labelKey: "sideMenu.queue", to: "/queue" },
  { labelKey: "sideMenu.favourites", to: "/favourites" },
  { labelKey: "sideMenu.history", to: "/history" },
  { labelKey: "sideMenu.profile", to: "/profile" },
] as const;

function useEscapeClose(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
}

function SideMenuLinks({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { t } = useTranslation();

  return (
    <ul>
      {LINKS.map((link) => (
        <li key={link.to}>
          <button className="side-menu__link" onClick={() => onNavigate(link.to)}>
            {t(link.labelKey)}
          </button>
        </li>
      ))}
    </ul>
  );
}

function SideMenu({ open, onClose }: SideMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const onNavigate = (to: string) => {
    onClose();
    navigate(to);
  };

  useEscapeClose(open, onClose);

  return (
    <div className={`side-menu ${open ? "side-menu--open" : ""}`} aria-hidden={!open}>
      <button className="side-menu__backdrop" onClick={onClose} tabIndex={-1} aria-label={t("sideMenu.close")} />

      <nav className="side-menu__panel" aria-label={t("sideMenu.label")}>
        <div className="side-menu__header">
          <img className="side-menu__brand" src={SECONDARY_LOGO} alt="SpisNem" />
          <button className="side-menu__close" onClick={onClose} aria-label={t("sideMenu.close")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <SideMenuLinks onNavigate={onNavigate} />

        <LanguageSwitcher className="side-menu__language" />

        <button
          className="side-menu__signin"
          onClick={() => onNavigate("/signin")}
        >
          {t("sideMenu.signIn")}
        </button>
      </nav>
    </div>
  );
}

export default SideMenu;
