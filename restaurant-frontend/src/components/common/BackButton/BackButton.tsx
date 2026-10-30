import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BackButtonProps } from "../../../types/generic";
import "./BackButton.scss";

const ICON_SIZE = 22;

/** Round white back button that floats over photos and screens. */
function BackButton({ label, onClick, className = "" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className={`back-button ${className}`}
      aria-label={label}
      onClick={onClick ?? (() => navigate(-1))}
    >
      <ChevronLeft size={ICON_SIZE} aria-hidden />
    </button>
  );
}

export default BackButton;
