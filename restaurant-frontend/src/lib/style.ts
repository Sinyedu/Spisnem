import type { CSSProperties } from "react";

// Inline background-image style for a cover thumbnail/hero, or nothing when the
// image is missing (so the CSS fallback colour shows through).
export const bgImage = (url: string | null | undefined): CSSProperties | undefined =>
  url ? { backgroundImage: `url(${url})` } : undefined;
