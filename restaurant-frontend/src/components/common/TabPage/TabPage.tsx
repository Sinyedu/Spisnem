import type { TabPageProps } from "../../../types/generic";
import BottomNav from "../BottomNav/BottomNav";
import "./TabPage.scss";

/** The frame for the screens behind the bottom tabs: a title, the content, and the tab bar. */
function TabPage({ title, children, className = "" }: TabPageProps) {
  return (
    <main className={`tab-page ${className}`}>
      {title && <h1 className="tab-page__title">{title}</h1>}
      {children}
      <BottomNav />
    </main>
  );
}

export default TabPage;
