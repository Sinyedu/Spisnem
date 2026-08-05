import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./IconButton.scss";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
};

export default function IconButton({ children, label, className = "", ...rest }: Props) {
  return (
    <button className={`icon-btn ${className}`} aria-label={label} {...rest}>
      {children}
    </button>
  );
}
