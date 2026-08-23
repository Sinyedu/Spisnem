import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "./ComingSoon.scss";

// Stands in for every screen that is routed but not built yet (sign in, sign up,
// queue, favourites). Delete a route from App.tsx as each real page lands.
function ComingSoon() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <main className="coming-soon">
      <span className="coming-soon__mark" aria-hidden>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      </span>

      <h1 className="coming-soon__title">{t("comingSoon.message")}</h1>

      <button className="coming-soon__back" onClick={() => navigate(-1)}>
        {t("comingSoon.back")}
      </button>
    </main>
  );
}

export default ComingSoon;
