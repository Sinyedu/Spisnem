import type { ReactNode } from "react";
import "./TabBar.scss";

export type Tab = { key: string; label: string; icon: ReactNode };

type Props = {
  tabs: Tab[];
  active: string;
  onSelect?: (key: string) => void;
};

export default function TabBar({ tabs, active, onSelect }: Props) {
  return (
    <nav className="tab-bar">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`tab-bar__item ${tab.key === active ? "tab-bar__item--active" : ""}`}
          onClick={() => onSelect?.(tab.key)}
        >
          <span className="tab-bar__icon">{tab.icon}</span>
          <span className="tab-bar__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
