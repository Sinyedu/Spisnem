import { useTranslation } from "react-i18next";
import type { QueueEntry } from "../../types/api";
import {
  useQueuePage,
  type QueueFormState,
  type QueueFormSubmit,
  type QueueFormUpdate,
} from "./useQueuePage";
import "./Queue.scss";

function QueueStatusCard({ entry }: { entry: QueueEntry }) {
  const { t } = useTranslation();

  return (
    <section className="queue-page__status">
      <p className="queue-page__eyebrow">{entry.restaurant.name}</p>
      <strong>{entry.position ?? "-"}</strong>
      <span>{t("queue.position")}</span>
      <p>{t("queue.waitLong", { minutes: entry.estimatedWaitMinutes ?? 0 })}</p>
    </section>
  );
}

type QueueFormProps = {
  failed: boolean;
  form: QueueFormState;
  onSubmit: QueueFormSubmit;
  onUpdate: QueueFormUpdate;
};

function QueueForm({ failed, form, onSubmit, onUpdate }: QueueFormProps) {
  const { t } = useTranslation();

  return (
    <form className="queue-page__form" onSubmit={(event) => void onSubmit(event)}>
      <label>{t("queue.name")}<input value={form.guestName} onChange={(e) => onUpdate({ guestName: e.target.value })} required /></label>
      <label>{t("queue.partySize")}<input type="number" min="1" max="20" value={form.partySize} onChange={(e) => onUpdate({ partySize: Number(e.target.value) })} required /></label>
      <label>{t("queue.phone")}<input value={form.phone} onChange={(e) => onUpdate({ phone: e.target.value })} inputMode="tel" /></label>
      {failed && <p className="queue-page__error">{t("queue.joinFailed")}</p>}
      <button className="queue-page__primary" type="submit">{t("queue.join")}</button>
    </form>
  );
}

function Queue() {
  const { t } = useTranslation();
  const queue = useQueuePage();

  return (
    <main className="queue-page">
      <div className="queue-page__nav">
        <button className="queue-page__back" onClick={queue.goBack}>{t("restaurant.back")}</button>
        <button className="queue-page__back" onClick={queue.goToMap}>{t("queue.backToMap")}</button>
      </div>
      <h1>{t("queue.title")}</h1>
      {queue.entry && <QueueStatusCard entry={queue.entry} />}
      {queue.canJoin && (
        <QueueForm
          failed={queue.failed}
          form={queue.form}
          onSubmit={queue.joinCurrentQueue}
          onUpdate={queue.updateForm}
        />
      )}
      {queue.isEmpty && <p className="queue-page__empty">{t("queue.empty")}</p>}
      {queue.entry && <button className="queue-page__secondary" onClick={() => void queue.leave()}>{t("queue.cancel")}</button>}
    </main>
  );
}

export default Queue;
