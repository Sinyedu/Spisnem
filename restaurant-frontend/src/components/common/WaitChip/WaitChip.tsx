import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { estimateWait } from "../../../lib/wait";
import type { WaitChipProps } from "../../../types/generic";
import "./WaitChip.scss";

const ICON_SIZE = 12;

/** The small "10 min" chip every restaurant shows. Closed queues get a muted chip. */
function WaitChip({ source }: WaitChipProps) {
  const { t } = useTranslation();
  const wait = estimateWait(source);

  if (!wait.open) {
    return <span className="wait-chip wait-chip--closed">{t(`wait.${wait.state}`)}</span>;
  }

  return (
    <span className="wait-chip tabular">
      <Clock size={ICON_SIZE} aria-hidden />
      {wait.minutes === 0 ? t("wait.none") : t("wait.minutes", { minutes: wait.minutes })}
    </span>
  );
}

export default WaitChip;
