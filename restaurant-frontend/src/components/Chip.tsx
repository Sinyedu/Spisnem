import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Chip.scss";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  children: ReactNode;
};

export default function Chip({ active = false, className = "", children, ...rest }: Props) {
  return (
    <button className={`chip ${active ? "chip--active" : ""} ${className}`} {...rest}>
      {children}
    </button>
  );
}
