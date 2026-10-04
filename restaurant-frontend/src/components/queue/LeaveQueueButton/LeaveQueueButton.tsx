import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { LeaveQueueButtonProps } from "../../../types/queue";
import "./LeaveQueueButton.scss";

/** "Leave queue", with a quick confirm step so nobody loses their place by accident. */
function LeaveQueueButton({ restaurantName, onLeave, tone = "light" }: LeaveQueueButtonProps) {
  const { t } = useTranslation();
  const [confirming, setConfirming] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function leave() {
    setLeaving(true);
    try {
      await onLeave();
    } finally {
      setLeaving(false);
    }
  }

  if (!confirming) {
    return (
      <button type="button" className={`leave-queue leave-queue--${tone}`} onClick={() => setConfirming(true)}>
        {t("queue.cancel")}
      </button>
    );
  }

  return (
    <div className={`leave-queue__confirm leave-queue--${tone}`} role="alertdialog" aria-live="polite">
      <p>{t("queue.leaveConfirm", { name: restaurantName })}</p>
      <div className="leave-queue__actions">
        <button type="button" onClick={() => setConfirming(false)}>{t("queue.stay")}</button>
        <button type="button" className="leave-queue__yes" disabled={leaving} onClick={() => void leave()}>
          {t("queue.leaveYes")}
        </button>
      </div>
    </div>
  );
}

export default LeaveQueueButton;
