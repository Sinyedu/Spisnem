import "./InfoCard.scss";
import type { InfoCardProps } from "./InfoCard.types";

function InfoCard({ icon, value, label }: InfoCardProps) {
  return (
    <div className="info-card">
      <div className="info-card__value">
        <span className="info-card__icon">{icon}</span>
        <span>{value}</span>
      </div>

      <span className="info-card__label">{label}</span>
    </div>
  );
}

export default InfoCard;