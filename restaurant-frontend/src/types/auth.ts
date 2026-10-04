// Prop types for the sign-in and sign-up screens, kept out of the components so a
// component file holds only its markup and behaviour.

export type SocialProvider = "google" | "apple";

export type AuthErrorBody = {
  message?: string;
  error?: { message?: string } | string;
};

export type SocialAuthResponse = {
  url?: string;
  redirect?: boolean;
};

export type SocialAuthButtonsProps = {
  onSelect: (provider: SocialProvider) => void;
  disabled?: boolean;
};

// The four inputs the two auth screens are built from. AuthField knows what each
// one looks like, so a screen only has to name the one it wants.
export type AuthFieldName = "name" | "email" | "password" | "newPassword";

export type AuthFieldProps = {
  name: AuthFieldName;
  value: string;
  onChange: (value: string) => void;
};
