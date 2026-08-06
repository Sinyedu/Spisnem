import "./Button.scss";
import type { ButtonProps } from "./Button.types";

const Button = ({
  children,
  variant = "primary",
  size = "large",
  fullWidth = true,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    fullWidth && "button--full",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      type={type}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button