import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../../../i18n";
import "./LanguageSwitcher.scss";

type LanguageSwitcherProps = {
  className?: string;
  showLabel?: boolean;
};

function LanguageSwitcher({ className = "", showLabel = true }: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();

  const current = i18n.resolvedLanguage ?? i18n.language;

  return (
    <div className={`language-switcher ${className}`}>
      {showLabel && <p className="language-switcher__label">{t("language.label")}</p>}

      <div className="language-switcher__options" role="group" aria-label={t("language.label")}>
        {LANGUAGES.map((language) => {
          const active = language.code === current;

          return (
            <button
              key={language.code}
              type="button"
              lang={language.code}
              aria-pressed={active}
              className={`language-switcher__option ${active ? "language-switcher__option--active" : ""}`}
              onClick={() => void i18n.changeLanguage(language.code)}
            >
              {language.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
