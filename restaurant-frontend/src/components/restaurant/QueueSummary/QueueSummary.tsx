import { useTranslation } from "react-i18next";
import { estimateWait } from "../../../lib/wait";
import type { RestaurantViewProps } from "../../../types/generic";
import "./QueueSummary.scss";

/** The dark "Wait right now" card: the one number a guest came to the page for. */
function QueueSummary({ restaurant }: RestaurantViewProps) {
  const { t } = useTranslation();
  const wait = estimateWait(restaurant);

  if (!wait.open) {
    return (
      <section className="queue-summary queue-summary--closed">
        <p className="queue-summary__label">{t(`wait.${wait.state}`)}</p>
        <p className="queue-summary__hint">{t(`restaurant.${wait.state}Hint`)}</p>
      </section>
    );
  }

  return (
    <section className="queue-summary" aria-live="polite">
      <div>
        <p className="queue-summary__label">{t("restaurant.waitNow")}</p>
        <p className="queue-summary__time tabular">
          {wait.minutes === 0 ? t("wait.none") : t("wait.about", { minutes: wait.minutes })}
        </p>
      </div>
      <div className="queue-summary__side">
        <p>{t("restaurant.partiesAhead", { count: wait.partiesAhead })}</p>
        <p className="queue-summary__open">
          <span aria-hidden /> {t("restaurant.queueOpen")}
        </p>
      </div>
    </section>
  );
}

export default QueueSummary;
