import { useNavigate } from "react-router-dom";

type Props = { prompt: string; linkLabel: string; to: string };

export default function AuthFooter({ prompt, linkLabel, to }: Props) {
  const navigate = useNavigate();
  return (
    <p className="auth__footer">
      {prompt}{" "}
      <a className="auth__link auth__link--strong" role="button" onClick={() => navigate(to)}>
        {linkLabel}
      </a>
    </p>
  );
}
