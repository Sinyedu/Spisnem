import { useTranslation } from "react-i18next";
import type { SocialAuthButtonsProps } from "../../../types/auth";
import { AppleIcon, GoogleIcon } from "./ProviderIcons";
import "./SocialAuthButtons.scss";

/**
 * Sign in with Google or Apple. Presentational for now: the backend is already
 * serving these providers at /api/customer/auth, but onSelect is wired in a
 * later PR, so pressing a button currently does nothing.
 */
function SocialAuthButtons({ onSelect }: SocialAuthButtonsProps) {
  const { t } = useTranslation();

  return (
    <div className="social-auth">
      <button
        type="button"
        className="social-auth__button"
        onClick={() => onSelect("google")}
      >
        <GoogleIcon />
        {t("auth.continueWithGoogle")}
      </button>

      <button
        type="button"
        className="social-auth__button social-auth__button--apple"
        onClick={() => onSelect("apple")}
      >
        <AppleIcon />
        {t("auth.continueWithApple")}
      </button>
    </div>
  );
}

export default SocialAuthButtons;
