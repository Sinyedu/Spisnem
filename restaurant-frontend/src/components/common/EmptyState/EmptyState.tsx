import { useNavigate } from "react-router-dom";
import type { EmptyStateProps } from "../../../types/generic";
import "./EmptyState.scss";

const ICON_SIZE = 28;

/** A calm "nothing here yet" with one way forward. */
function EmptyState({ icon: Icon, title, body, actionLabel, actionTo }: EmptyStateProps) {
  const navigate = useNavigate();
  return (
    <section className="empty-state">
      <span className="empty-state__icon" aria-hidden>
        <Icon size={ICON_SIZE} strokeWidth={1.6} />
      </span>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__body">{body}</p>
      {actionLabel && actionTo && (
        <button type="button" className="empty-state__action" onClick={() => navigate(actionTo)}>
          {actionLabel}
        </button>
      )}
    </section>
  );
}

export default EmptyState;
