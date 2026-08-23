import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthField from "../../../components/auth/AuthField/AuthField";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import type { SocialProvider } from "../../../types/auth";
import "./Login.scss";

function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Both handlers are deliberately inert. The backend already serves this at
  // POST /api/customer/auth/sign-in/email; calling it is the next PR.
  const signInWith = (provider: SocialProvider) => console.info("[auth] todo", provider);
  const handleSubmit = (event: FormEvent) => event.preventDefault();

  return (
    <main className="auth">
      <h1 className="auth__title">{t("auth.signInTitle")}</h1>

      <SocialAuthButtons onSelect={signInWith} />
      <p className="auth__divider">{t("auth.or")}</p>

      <form className="auth__form" onSubmit={handleSubmit}>
        <AuthField name="email" value={email} onChange={setEmail} />
        <AuthField name="password" value={password} onChange={setPassword} />

        <button className="btn btn--primary" type="submit">
          {t("auth.signIn")}
        </button>
      </form>

      <p className="auth__switch">
        {t("auth.noAccount")} <Link to="/signup">{t("auth.createAccount")}</Link>
      </p>
    </main>
  );
}

export default Login;
