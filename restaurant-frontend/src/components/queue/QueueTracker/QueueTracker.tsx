import type { CSSProperties } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueueCountdown } from "./useQueueCountdown";
import { useQueueTracker } from "./useQueueTracker";
import type { QueueEntry } from "../../../types/api";
import "./QueueTracker.scss";

type TrackerStyle = CSSProperties & {
  "--queue-progress": string;
};

function QueueTrackerButton({ entry }: { entry: QueueEntry }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const countdown = useQueueCountdown(entry);
  const style: TrackerStyle = { "--queue-progress": `${countdown.progress}%` };

  return (
    <button
      className="queue-tracker"
      style={style}
      type="button"
      onClick={() => navigate("/queue")}
      aria-label={t("queue.trackerLabel")}
    >
      <span className="queue-tracker__inner">
        <span className="queue-tracker__position">{entry.position ?? "-"}</span>
        <span className="queue-tracker__time">
          {countdown.remainingMinutes === null ? t("queue.waitUnknown") : t("queue.waitShort", {
            minutes: countdown.remainingMinutes,
          })}
        </span>
      </span>
    </button>
  );
}

function QueueTracker() {
  const entry = useQueueTracker();
  return entry ? <QueueTrackerButton entry={entry} /> : null;
}

export default QueueTracker;
