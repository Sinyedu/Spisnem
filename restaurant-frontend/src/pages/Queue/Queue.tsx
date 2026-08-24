import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import type { QueueEntry } from "../../types/api";
import { useQueuePage } from "./useQueuePage";
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
  onJoin: (input: { guestName: string; partySize: number; phone?: string }) => Promise<void>;
  onFailed: () => void;
};

function QueueForm({ failed, onJoin, onFailed }: QueueFormProps) {
  const { t } = useTranslation();
  const [guestName, setGuestName] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [phone, setPhone] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    await onJoin({ guestName, partySize, phone: phone || undefined });
  }

  return (
    <form className="queue-page__form" onSubmit={(event) => void submit(event).catch(onFailed)}>
      <label>{t("queue.name")}<input value={guestName} onChange={(e) => setGuestName(e.target.value)} required /></label>
      <label>{t("queue.partySize")}<input type="number" min="1" max="20" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} required /></label>
      <label>{t("queue.phone")}<input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" /></label>
      {failed && <p className="queue-page__error">{t("queue.joinFailed")}</p>}
      <button className="queue-page__primary" type="submit">{t("queue.join")}</button>
    </form>
  );
}

function Queue() {
  const { t } = useTranslation();
  const { slug } = useParams();
  const navigate = useNavigate();
  const queue = useQueuePage();

  return (
    <main className="queue-page">
      <div className="queue-page__nav">
        <button className="queue-page__back" onClick={() => navigate(-1)}>{t("restaurant.back")}</button>
        <button className="queue-page__back" onClick={() => navigate("/map")}>{t("queue.backToMap")}</button>
      </div>
      <h1>{t("queue.title")}</h1>
      {queue.entry && <QueueStatusCard entry={queue.entry} />}
      {!queue.entry && slug && (
        <QueueForm
          failed={queue.failed}
          onJoin={(input) => queue.join(slug, input)}
          onFailed={queue.markFailed}
        />
      )}
      {!queue.entry && !slug && <p className="queue-page__empty">{t("queue.empty")}</p>}
      {queue.entry && <button className="queue-page__secondary" onClick={() => void queue.leave()}>{t("queue.cancel")}</button>}
    </main>
  );
}

export default Queue;
