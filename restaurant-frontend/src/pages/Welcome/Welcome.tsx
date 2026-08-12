import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/common/LanguageSwitcher/LanguageSwitcher";
import { getSummary } from "../../lib/summary";
import "./Welcome.scss";

export default function Welcome() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openNow, setOpenNow] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    // The badge is decorative — if the API is unavailable we simply omit the count.
    getSummary()
      .then((s) => active && setOpenNow(s.openNow))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="welcome">
      <header className="welcome__topbar">
        <LanguageSwitcher className="welcome__language" showLabel={false} />
      </header>

      <section className="welcome__hero">
        <div className="welcome__badge">
          <span className="welcome__ring welcome__ring--1" />
          <span className="welcome__ring welcome__ring--2" />
          <span className="welcome__mark" aria-hidden>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11" />
              <path d="M17 3c-1.7 0-3 2-3 4.5S15.3 12 17 12v9" />
            </svg>
          </span>
          <span className="welcome__pill welcome__pill--open">
            <span className="welcome__dot" />{" "}
            {openNow === null ? t("welcome.openNowUnknown") : t("welcome.openNow", { count: openNow })}
          </span>
          <span className="welcome__pill welcome__pill--rating">★ {t("welcome.topRated")}</span>
        </div>

        {/* Placeholder for the animated logo — swap this wordmark for the SVG later. */}
        <h1 className="welcome__wordmark">SPISNEM</h1>
        <p className="welcome__tagline">{t("welcome.tagline")}</p>
      </section>

      <section className="welcome__actions">
        <button className="btn btn--primary" onClick={() => navigate("/signup")}>
          {t("welcome.createAccount")}
        </button>
        <button className="btn btn--secondary" onClick={() => navigate("/signin")}>
          {t("welcome.signIn")}
        </button>
        {/* /map is the landing screen once you are in — sign in and sign up send you
            here too, as soon as those screens exist. */}
        <button className="btn btn--ghost" onClick={() => navigate("/map")}>
          {t("welcome.continueAsGuest")}
        </button>

        <div className="welcome__dots" aria-hidden>
          <span className="welcome__page welcome__page--active" />
          <span className="welcome__page" />
          <span className="welcome__page" />
          <span className="welcome__page" />
        </div>
      </section>
    </main>
  );
}
