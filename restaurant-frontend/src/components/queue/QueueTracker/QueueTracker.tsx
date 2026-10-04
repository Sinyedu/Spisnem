import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { useQueueCountdown } from "../../../hooks/useQueueCountdown";
import { useCurrentQueueEntry } from "../../../session/queueEntryContext";
import type { QueueEntryProps } from "../../../types/queue";
import "./QueueTracker.scss";

// Queue screens show the full ticket and tab screens show a badge on My queue,
// so the floating tracker only appears on the other screens (restaurant, menu).
const HIDDEN_ON = /\/queue$|^\/(map|favourites|history|profile)$/;

function TrackerPill({ entry }: QueueEntryProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const countdown = useQueueCountdown(entry);
  const called = entry.status === "notified";
  const time = countdown.remainingMinutes === null ? t("queue.waitUnknown") : t("queue.waitShort", { minutes: countdown.remainingMinutes });

  return (
    <button
      type="button"
      className={`queue-tracker ${called ? "queue-tracker--called" : ""}`}
      onClick={() => navigate("/queue")}
      aria-label={t("queue.trackerLabel")}
    >
      <span className="queue-tracker__dot" aria-hidden />
      {called ?
        <span>{t("queue.trackerCalled")}</span>
      : <span className="tabular">#{entry.position ?? "–"} · {time}</span>}
    </button>
  );
}

/** A small pill on every screen that says where you are in line. Tap it for the ticket. */
function QueueTracker() {
  const { pathname } = useLocation();
  const { entry } = useCurrentQueueEntry();
  const active = entry?.status === "waiting" || entry?.status === "notified";
  if (!entry || !active || HIDDEN_ON.test(pathname)) return null;
  return <TrackerPill entry={entry} />;
}

export default QueueTracker;
