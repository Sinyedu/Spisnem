// Prop types for the sign-in and sign-up screens, kept out of the components so a
// component file holds only its markup and behaviour.

export type SocialProvider = "google" | "apple";

export type SocialAuthButtonsProps = {
  // The screens pass a placeholder for now; the real calls land in a later PR.
  onSelect: (provider: SocialProvider) => void;
};

// The four inputs the two auth screens are built from. AuthField knows what each
// one looks like, so a screen only has to name the one it wants.
export type AuthFieldName = "name" | "email" | "password" | "newPassword";

export type AuthFieldProps = {
  name: AuthFieldName;
  value: string;
  onChange: (value: string) => void;
};
