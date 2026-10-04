import { useTranslation } from "react-i18next";
import type { QueueStatus } from "../../../types/api";
import type { QueueOutcomeProps } from "../../../types/queue";
import "./QueueOutcome.scss";

type OutcomeStatus = Exclude<QueueStatus, "waiting" | "notified">;

const OUTCOME_KEYS = {
  seated: { title: "queue.outcome.seatedTitle", body: "queue.outcome.seatedBody" },
  cancelled: { title: "queue.outcome.cancelledTitle", body: "queue.outcome.cancelledBody" },
  no_show: { title: "queue.outcome.noShowTitle", body: "queue.outcome.noShowBody" },
} as const satisfies Record<OutcomeStatus, { title: string; body: string }>;

/** How a visit ended: seated, left, or the table went to the next guest. */
function QueueOutcome({ entry, onDone }: QueueOutcomeProps) {
  const { t } = useTranslation();
  const keys = OUTCOME_KEYS[entry.status as OutcomeStatus] ?? OUTCOME_KEYS.cancelled;

  return (
    <section className="queue-outcome">
      <h1 className="queue-outcome__title">{t(keys.title)}</h1>
      <p className="queue-outcome__body">{t(keys.body, { name: entry.restaurant.name })}</p>
      <button type="button" className="queue-outcome__primary" onClick={onDone}>
        {t("queue.outcome.findAnother")}
      </button>
    </section>
  );
}

export default QueueOutcome;
