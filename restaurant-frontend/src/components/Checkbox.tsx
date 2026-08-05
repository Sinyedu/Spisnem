import type { ReactNode } from "react";
import { CheckIcon } from "./icons";
import "./Checkbox.scss";

type Props = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
};

export default function Checkbox({ checked, onChange, children }: Props) {
  return (
    <label className="checkbox">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        className={`checkbox__box ${checked ? "checkbox__box--on" : ""}`}
        onClick={() => onChange(!checked)}
      >
        {checked && <CheckIcon size={16} />}
      </button>
      <span className="checkbox__label">{children}</span>
    </label>
  );
}
