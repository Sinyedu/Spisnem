import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import AuthField from "../../../components/auth/AuthField/AuthField";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import type { SocialProvider } from "../../../types/auth";
import "../Login/Login.scss";

function Register() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Inert for now, exactly as on the sign-in screen — wiring is the next PR.
  const signUpWith = (provider: SocialProvider) => console.info("[auth] todo", provider);
  const handleSubmit = (event: FormEvent) => event.preventDefault();

  return (
    <main className="auth">
      <h1 className="auth__title">{t("auth.createAccountTitle")}</h1>

      <SocialAuthButtons onSelect={signUpWith} />
      <p className="auth__divider">{t("auth.or")}</p>

      <form className="auth__form" onSubmit={handleSubmit}>
        <AuthField name="name" value={name} onChange={setName} />
        <AuthField name="email" value={email} onChange={setEmail} />
        <AuthField name="newPassword" value={password} onChange={setPassword} />

        <button className="btn btn--primary" type="submit">
          {t("auth.createAccount")}
        </button>
      </form>

      <p className="auth__switch">
        {t("auth.haveAccount")} <Link to="/signin">{t("auth.signIn")}</Link>
      </p>
    </main>
  );
}

export default Register;
