import type { ReactNode } from "react";
import "./StatTile.scss";

type Props = {
  icon: ReactNode;
  value: ReactNode;
  label: string;
  tone?: "neutral" | "accent";
};

export default function StatTile({ icon, value, label, tone = "neutral" }: Props) {
  return (
    <div className={`stat-tile stat-tile--${tone}`}>
      <div className="stat-tile__top">
        <span className="stat-tile__icon">{icon}</span>
        <span className="stat-tile__value">{value}</span>
      </div>
      <span className="stat-tile__label">{label}</span>
    </div>
  );
}
