import type { ReactNode } from "react";
import "./CenteredState.scss";

// Full-height centered column shared by loading / empty / error screens.
export default function CenteredState({ children }: { children: ReactNode }) {
  return <div className="centered-state">{children}</div>;
}
