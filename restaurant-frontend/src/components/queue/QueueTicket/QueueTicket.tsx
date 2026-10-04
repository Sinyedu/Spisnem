import type { TFunction } from "i18next";
import { Radio } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ALMOST_MINUTES, useQueueCountdown } from "../../../hooks/useQueueCountdown";
import type { QueueEntryProps, QueueTicketProps } from "../../../types/queue";
import LeaveQueueButton from "../LeaveQueueButton/LeaveQueueButton";
import QueueRing from "../QueueRing/QueueRing";
import RunningLate from "../RunningLate/RunningLate";
import "./QueueTicket.scss";

const ICON_SIZE = 14;
const joinedTime = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" });

function timeText(t: TFunction, remaining: number | null) {
  if (remaining === null) return t("queue.waitUnknown");
  if (remaining < ALMOST_MINUTES) return t("queue.almost");
  return t("wait.about", { minutes: remaining });
}

function TicketRows({ entry }: QueueEntryProps) {
  const { t } = useTranslation();
  const ahead = Math.max(0, (entry.position ?? 1) - 1);
  return (
    <dl className="queue-ticket__rows">
      <div><dt>{t("queue.partiesAheadLabel")}</dt><dd className="tabular">{ahead}</dd></div>
      <div><dt>{t("queue.partyLabel")}</dt><dd>{t("queue.people", { count: entry.partySize })}</dd></div>
      {entry.quotedWaitMinutes !== null && (
        <div><dt>{t("queue.promisedLabel")}</dt><dd className="tabular">{t("wait.minutes", { minutes: entry.quotedWaitMinutes })}</dd></div>
      )}
      <div><dt>{t("queue.joinedLabel")}</dt><dd className="tabular">{joinedTime.format(new Date(entry.joinedAt))}</dd></div>
    </dl>
  );
}

/** The live ticket: ring with the place in line, minutes left, and what to do meanwhile. */
function QueueTicket({ entry, onLeave, onLate }: QueueTicketProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const countdown = useQueueCountdown(entry);

  return (
    <section className="queue-ticket" aria-live="polite">
      <p className="queue-ticket__venue">{t("queue.partyAt", { name: entry.restaurant.name, count: entry.partySize })}</p>
      <QueueRing progress={countdown.progress} position={entry.position} />
      <p className="queue-ticket__time">{timeText(t, countdown.remainingMinutes)}</p>
      <p className="queue-ticket__hint">{entry.position === 1 ? t("queue.nextHint") : t("queue.walkHint")}</p>
      <p className="queue-ticket__ping"><Radio size={ICON_SIZE} aria-hidden /> {t("queue.pingHint")}</p>
      <TicketRows entry={entry} />
      <div className="queue-ticket__actions">
        <button type="button" className="queue-ticket__primary" onClick={() => navigate(`/restaurants/${entry.restaurant.slug}/menu`)}>
          {t("queue.seeMenu")}
        </button>
        {entry.canReportLate && <RunningLate onLate={onLate} />}
        <LeaveQueueButton restaurantName={entry.restaurant.name} onLeave={onLeave} />
      </div>
    </section>
  );
}

export default QueueTicket;
