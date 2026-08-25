import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import AuthField from "../../../components/auth/AuthField/AuthField";
import SocialAuthButtons from "../../../components/auth/SocialAuthButtons/SocialAuthButtons";
import type { SocialProvider } from "../../../types/auth";
import { signInWithSocial, signUpWithEmail } from "../../../lib/auth";
import "../Login/Login.scss";

function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      setError(t("auth.signUpFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  const signUpWith = (provider: SocialProvider) => void runAuth(() => signInWithSocial(provider));
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void runAuth(() => signUpWithEmail(name, email, password));
  };

  return (
    <main className="auth">
      <h1 className="auth__title">{t("auth.createAccountTitle")}</h1>

      <SocialAuthButtons onSelect={signUpWith} disabled={submitting} />
      <p className="auth__divider">{t("auth.or")}</p>

      <form className="auth__form" onSubmit={handleSubmit}>
        <AuthField name="name" value={name} onChange={setName} />
        <AuthField name="email" value={email} onChange={setEmail} />
        <AuthField name="newPassword" value={password} onChange={setPassword} />

        {error && (
          <p className="auth__error" role="alert">
            {error}
          </p>
        )}

        <button className="btn btn--primary" type="submit" disabled={submitting}>
          {t(submitting ? "auth.creatingAccount" : "auth.createAccount")}
        </button>
      </form>

      <p className="auth__switch">
        {t("auth.haveAccount")} <Link to="/signin">{t("auth.signIn")}</Link>
      </p>
    </main>
  );
}

export default Register;
