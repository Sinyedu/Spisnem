import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LateMinutes } from "../../../types/api";
import type { RunningLateProps } from "../../../types/queue";
import "./RunningLate.scss";

// The same three choices the backend accepts.
const OPTIONS: LateMinutes[] = [5, 10, 15];

/** "Running late?" Lets the guest step back in line once, instead of missing their turn. */
function RunningLate({ onLate }: RunningLateProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  async function choose(minutes: LateMinutes) {
    setSending(true);
    try {
      await onLate(minutes);
    } finally {
      setSending(false);
      setOpen(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="running-late__toggle" onClick={() => setOpen(true)}>
        {t("queue.runningLate")}
      </button>
    );
  }

  return (
    <div className="running-late" role="group" aria-label={t("queue.runningLate")}>
      <p className="running-late__hint">{t("queue.lateHint")}</p>
      <div className="running-late__options">
        {OPTIONS.map((minutes) => (
          <button key={minutes} type="button" disabled={sending} onClick={() => void choose(minutes)}>
            {t("queue.lateOption", { minutes })}
          </button>
        ))}
      </div>
    </div>
  );
}

export default RunningLate;
