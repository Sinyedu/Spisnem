import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SideMenu.scss";
import type { SideMenuProps } from "../../../types/generic";


// Discovery happens on the map itself; the rest arrive in later PRs and land on
// the ComingSoon route until then.
const LINKS = [
  { label: "Explore map", to: "/map" },
  { label: "Queue", to: "/queue" },
  { label: "Favourites", to: "/favourites" },
];

function SideMenu({ open, onClose }: SideMenuProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div className={`side-menu ${open ? "side-menu--open" : ""}`} aria-hidden={!open}>
      <button className="side-menu__backdrop" onClick={onClose} tabIndex={-1} aria-label="Close menu" />

      <nav className="side-menu__panel" aria-label="Main menu">
        <div className="side-menu__header">
          <p className="side-menu__brand">SPISNEM</p>
          <button className="side-menu__close" onClick={onClose} aria-label="Close menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <ul>
          {LINKS.map((link) => (
            <li key={link.to}>
              <button
                className="side-menu__link"
                onClick={() => {
                  onClose();
                  navigate(link.to);
                }}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          className="side-menu__signin"
          onClick={() => {
            onClose();
            navigate("/signin");
          }}
        >
          Sign in
        </button>
      </nav>
    </div>
  );
}

export default SideMenu;
