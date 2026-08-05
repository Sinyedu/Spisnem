import { useNavigate } from "react-router-dom";
import IconButton from "./IconButton";
import { BackIcon } from "./icons";
import "./AuthHeader.scss";

export default function AuthHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  const navigate = useNavigate();
  return (
    <header className="auth-head">
      <IconButton label="Go back" onClick={() => navigate(-1)}>
        <BackIcon />
      </IconButton>
      <p className="auth-head__eyebrow">{eyebrow}</p>
      <h1 className="auth-head__title">{title}</h1>
    </header>
  );
}
