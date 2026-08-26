import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from "../../components/common/LanguageSwitcher/LanguageSwitcher";
import AnimatedWelcomeLogo from "./AnimatedWelcomeLogo";
import "./Welcome.scss";

function WelcomeHero() {
  const { t } = useTranslation();

  return (
    <section className="welcome__hero">
      <div className="welcome__logo-stage">
        <AnimatedWelcomeLogo />
      </div>
      <p className="welcome__tagline">{t("welcome.tagline")}</p>
    </section>
  );
}

function WelcomeActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="welcome__actions">
      <button className="btn btn--primary" onClick={() => navigate("/signup")}>
        {t("welcome.createAccount")}
      </button>
      <button className="btn btn--secondary" onClick={() => navigate("/signin")}>
        {t("welcome.signIn")}
      </button>
      <button className="btn btn--ghost" onClick={() => navigate("/map")}>
        {t("welcome.continueAsGuest")}
      </button>
    </section>
  );
}

export default function Welcome() {
  return (
    <main className="welcome">
      <header className="welcome__topbar">
        <LanguageSwitcher className="welcome__language" showLabel={false} />
      </header>
      <WelcomeHero />
      <WelcomeActions />
    </main>
  );
}
