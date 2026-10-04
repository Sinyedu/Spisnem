import { useTranslation } from "react-i18next";
import type { QueueRingProps } from "../../../types/queue";
import "./QueueRing.scss";

// The ring is drawn in a 160×160 box; these keep the stroke inside it.
const VIEWBOX = 160;
const RADIUS = 64;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
// A sliver always shows, so a fresh ticket doesn't look empty.
const MIN_PROGRESS = 0.04;

/** Big "#2" inside a ring that fills as the guest moves up the line. */
function QueueRing({ progress, position }: QueueRingProps) {
  const { t } = useTranslation();
  const filled = Math.min(1, Math.max(MIN_PROGRESS, progress));

  return (
    <div className="queue-ring" role="img" aria-label={t("queue.positionAria", { position: position ?? "–" })}>
      <svg viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden>
        <circle className="queue-ring__track" cx={VIEWBOX / 2} cy={VIEWBOX / 2} r={RADIUS} />
        <circle
          className="queue-ring__fill"
          cx={VIEWBOX / 2}
          cy={VIEWBOX / 2}
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - filled)}
        />
      </svg>
      <span className="queue-ring__center" aria-hidden>
        <span className="queue-ring__label">{t("queue.youAre")}</span>
        <span className="queue-ring__position tabular">#{position ?? "–"}</span>
      </span>
    </div>
  );
}

export default QueueRing;
