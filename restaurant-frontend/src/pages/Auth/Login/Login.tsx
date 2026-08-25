import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../../../components/auth/AuthField/AuthField";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import type { SocialProvider } from "../../../types/auth";
import { signInWithEmail, signInWithSocial } from "../../../lib/auth";
import "./Login.scss";

function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const runAuth = async (request: () => Promise<unknown>) => {
    setSubmitting(true);
    setError("");
    try {
      await request();
      navigate("/map", { replace: true });
    } catch {
      setError(t("auth.signInFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const signInWith = (provider: SocialProvider) => void runAuth(() => signInWithSocial(provider));
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void runAuth(() => signInWithEmail(email, password));
  };

  return (
    <main className="auth">
      <h1 className="auth__title">{t("auth.signInTitle")}</h1>

      <SocialAuthButtons onSelect={signInWith} disabled={submitting} />
      <p className="auth__divider">{t("auth.or")}</p>

      <form className="auth__form" onSubmit={handleSubmit}>
        <AuthField name="email" value={email} onChange={setEmail} />
        <AuthField name="password" value={password} onChange={setPassword} />

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {t(submitting ? "auth.signingIn" : "auth.signIn")}
        </button>
      </form>

      <p className="auth__switch">
        {t("auth.noAccount")} <Link to="/signup">{t("auth.createAccount")}</Link>
      </p>
    </main>
  );
}

export default Login;
