import { useEffect, type ReactNode } from "react";
import "./BottomSheet.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export default function BottomSheet({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sheet" role="dialog" aria-modal="true" aria-label={title}>
      <button className="sheet__backdrop" aria-label="Close" onClick={onClose} />
      <div className="sheet__panel">
        <span className="sheet__handle" />
        {title && <h2 className="sheet__title">{title}</h2>}
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  );
}
