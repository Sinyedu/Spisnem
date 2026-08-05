import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../../components/AuthFooter";
import AuthScreen from "../../components/AuthScreen";
import SocialButtons from "../../components/SocialButtons";
import TextField from "../../components/TextField";

export default function Signin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // UI-only: no backend auth yet. Validate locally and continue as a guest.
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 1) {
      setError("Enter your email and password.");
      return;
    }
    navigate("/discover");
  }

  return (
    <AuthScreen
      eyebrow="Welcome back"
      title="Sign in"
      submitLabel="Sign in"
      onSubmit={onSubmit}
      error={error}
      belowForm={<SocialButtons />}
      footer={<AuthFooter prompt="No account yet?" linkLabel="Create one" to="/signup" />}
    >
      <TextField
        label="Email address"
        name="email"
        type="email"
        placeholder="anna@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        name="password"
        secureToggle
        placeholder="Your password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="auth__row">
        <a className="auth__link" role="button">
          Forgot password?
        </a>
      </div>
    </AuthScreen>
  );
}
