import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.scss";

type Variant = "primary" | "secondary" | "ghost";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  full?: boolean;
  children: ReactNode;
};

export default function Button({
  variant = "primary",
  full = false,
  className = "",
  children,
  ...rest
}: Props) {
  const classes = ["btn", `btn--${variant}`, full ? "btn--full" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
