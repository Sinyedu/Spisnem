import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import AuthFooter from "../../components/AuthFooter";
import AuthScreen from "../../components/AuthScreen";
import Checkbox from "../../components/Checkbox";
import TextField from "../../components/TextField";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  // UI-only: no backend auth yet. Validate locally and continue as a guest.
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || password.length < 8) {
      setError("Please complete every field (password needs 8+ characters).");
      return;
    }
    if (!agreed) {
      setError("Please accept the Terms to continue.");
      return;
    }
    navigate("/discover");
  }

  return (
    <AuthScreen
      eyebrow="Get started"
      title="Create account"
      submitLabel="Create account"
      onSubmit={onSubmit}
      error={error}
      footer={<AuthFooter prompt="Already have an account?" linkLabel="Sign in" to="/signin" />}
    >
      <TextField
        label="Full name"
        name="name"
        placeholder="Anna Kowalski"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
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
        placeholder="At least 8 characters"
        helper="Use letters, numbers and at least one symbol."
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Checkbox checked={agreed} onChange={setAgreed}>
        I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>
      </Checkbox>
    </AuthScreen>
  );
}
