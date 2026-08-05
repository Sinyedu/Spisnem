import { useState, type InputHTMLAttributes } from "react";
import { EyeIcon, EyeOffIcon } from "./icons";
import "./TextField.scss";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: string;
  type?: string;
  helper?: string;
  error?: string;
  secureToggle?: boolean;
};

export default function TextField({
  label,
  type = "text",
  helper,
  error,
  secureToggle = false,
  id,
  className = "",
  ...rest
}: Props) {
  const [revealed, setRevealed] = useState(false);
  const inputType = secureToggle ? (revealed ? "text" : "password") : type;
  const fieldId = id ?? rest.name;

  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      {label && (
        <label className="field__label" htmlFor={fieldId}>
          {label}
        </label>
      )}
      <div className="field__control">
        <input id={fieldId} className="field__input" type={inputType} {...rest} />
        {secureToggle && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "Hide password" : "Show password"}
          >
            {revealed ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="field__msg field__msg--error">{error}</p>
      ) : helper ? (
        <p className="field__msg">{helper}</p>
      ) : null}
    </div>
  );
}
