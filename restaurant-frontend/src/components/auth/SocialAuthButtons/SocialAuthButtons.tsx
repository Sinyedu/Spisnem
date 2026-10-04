import { useTranslation } from "react-i18next";
import type { SocialAuthButtonsProps } from "../../../types/auth";
import { AppleIcon, GoogleIcon } from "./ProviderIcons";
import "./SocialAuthButtons.scss";

function SocialAuthButtons({ onSelect, disabled = false }: SocialAuthButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="social-auth">
      <button
        type="button"
        className="social-auth__button"
        onClick={() => onSelect("google")}
        disabled={disabled}
      >
        <GoogleIcon />
        {t("auth.continueWithGoogle")}
      </button>

      <button
        type="button"
        className="social-auth__button social-auth__button--apple"
        onClick={() => onSelect("apple")}
        disabled={disabled}
      >
        <AppleIcon />
        {t("auth.continueWithApple")}
      </button>
    </div>
  );
}

export default SocialAuthButtons;
