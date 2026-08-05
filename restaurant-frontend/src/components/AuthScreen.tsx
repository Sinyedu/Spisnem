import type { FormEvent, ReactNode } from "react";
import AuthHeader from "./AuthHeader";
import Button from "./Button";
import "../pages/authForm.scss";

type Props = {
  eyebrow: string;
  title: string;
  submitLabel: string;
  onSubmit: (event: FormEvent) => void;
  error?: string;
  children: ReactNode; // form fields
  belowForm?: ReactNode; // e.g. social buttons
  footer: ReactNode;
};

// Shared scaffold for the auth screens: header, a submitting form with a shared
// error slot + primary button, and a footer. Screens only supply their fields.
export default function AuthScreen({
  eyebrow,
  title,
  submitLabel,
  onSubmit,
  error,
  children,
  belowForm,
  footer,
}: Props) {
  return (
    <div className="auth">
      <AuthHeader eyebrow={eyebrow} title={title} />

      <form className="auth__form" onSubmit={onSubmit}>
        {children}
        {error && <p className="field__msg field__msg--error">{error}</p>}
        <Button full type="submit" className="auth__submit">
          {submitLabel}
        </Button>
      </form>

      {belowForm}
      {footer}
    </div>
  );
}
