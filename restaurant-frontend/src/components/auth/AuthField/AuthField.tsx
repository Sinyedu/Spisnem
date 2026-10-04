import type { ParseKeys } from "i18next";
import { useTranslation } from "react-i18next";
import type { AuthFieldName, AuthFieldProps } from "../../../types/auth";
import "./AuthField.scss";

// Matches what the backend accepts on POST /api/customer/auth/sign-up/email.
const MINIMUM_PASSWORD_LENGTH = 8;

type FieldShape = {
  type: "text" | "email" | "password";
  // ParseKeys is the set of keys da.json actually defines, so a typo here is a
  // compile error rather than a blank label at runtime.
  labelKey: ParseKeys;
  placeholderKey: ParseKeys;
  autoComplete: string;
  minLength?: number;
};

// Everything that differs between the fields, in one place.
const FIELDS: Record<AuthFieldName, FieldShape> = {
  name: {
    type: "text",
    labelKey: "auth.name",
    placeholderKey: "auth.namePlaceholder",
    autoComplete: "name",
  },
  email: {
    type: "email",
    labelKey: "auth.email",
    placeholderKey: "auth.emailPlaceholder",
    autoComplete: "email",
  },
  password: {
    type: "password",
    labelKey: "auth.password",
    placeholderKey: "auth.passwordPlaceholder",
    autoComplete: "current-password",
  },
  newPassword: {
    type: "password",
    labelKey: "auth.password",
    placeholderKey: "auth.passwordPlaceholder",
    autoComplete: "new-password",
    minLength: MINIMUM_PASSWORD_LENGTH,
  },
};

/** One labelled input. Both auth screens are built from these. */
function AuthField({ name, value, onChange }: AuthFieldProps) {
  const { t } = useTranslation();
  const field = FIELDS[name];

  return (
    <label className="auth-field">
      <span className="auth-field__label">{t(field.labelKey)}</span>

      <input
        className="auth-field__input"
        type={field.type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t(field.placeholderKey)}
        autoComplete={field.autoComplete}
        minLength={field.minLength}
        required
      />
    </label>
  );
}

export default AuthField;
