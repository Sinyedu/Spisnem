import type { ReactNode } from "react";
import "./AppShell.scss";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <div className="app-shell__viewport">{children}</div>
    </div>
  );
}
