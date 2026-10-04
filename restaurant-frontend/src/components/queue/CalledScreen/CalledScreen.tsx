import { BellRing, Check } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useGraceCountdown } from "../../../hooks/useGraceCountdown";
import type { CalledScreenProps, OnMyWayButtonProps } from "../../../types/queue";
import LeaveQueueButton from "../LeaveQueueButton/LeaveQueueButton";
import "./CalledScreen.scss";

const ICON_SIZE = 44;
const CHECK_SIZE = 18;
const MS_PER_MINUTE = 60_000;

// Minutes the restaurant gave the guest, rounded up, for the sentence under the title.
function graceMinutes(notifiedAt: string | null, graceUntil: string | null) {
  if (!notifiedAt || !graceUntil) return null;
  return Math.ceil((Date.parse(graceUntil) - Date.parse(notifiedAt)) / MS_PER_MINUTE);
}

function OnMyWayButton({ entry, onMyWay }: OnMyWayButtonProps) {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  if (entry.onMyWayAt) {
    return <p className="called__confirmed"><Check size={CHECK_SIZE} aria-hidden /> {t("queue.onMyWayDone")}</p>;
  }
  return (
    <button type="button" className="called__primary" disabled={sending}
      onClick={() => { setSending(true); void onMyWay().finally(() => setSending(false)); }}>
      {t("queue.onMyWay")}
    </button>
  );
}

/** Full-screen terracotta "It's your turn": the moment the whole app exists for. */
function CalledScreen({ entry, onLeave, onMyWay }: CalledScreenProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const grace = useGraceCountdown(entry.graceUntil);
  const minutes = graceMinutes(entry.notifiedAt, entry.graceUntil);

  return (
    <section className="called" role="alert">
      <span className="called__bell" aria-hidden><BellRing size={ICON_SIZE} strokeWidth={1.6} /></span>
      <p className="called__venue">{entry.restaurant.name}</p>
      <h1 className="called__title">{t("queue.calledTitle")}</h1>
      <p className="called__body">{minutes ? t("queue.calledBody", { minutes }) : t("queue.calledBodyShort")}</p>
      {grace && (
        <p className="called__timer tabular" aria-label={t("queue.timeLeft")}>{grace.expired ? t("queue.graceOver") : grace.left}</p>
      )}
      <div className="called__actions">
        <OnMyWayButton entry={entry} onMyWay={onMyWay} />
        <button type="button" className="called__secondary" onClick={() => navigate(`/restaurants/${entry.restaurant.slug}`)}>
          {t("queue.whereToGo")}
        </button>
        <LeaveQueueButton restaurantName={entry.restaurant.name} onLeave={onLeave} tone="onAccent" />
      </div>
    </section>
  );
}

export default CalledScreen;
