import { useTranslation } from "react-i18next";
import type { EstimateBannerProps, JoinFormProps } from "../../../types/queue";
import PartySizePicker from "../PartySizePicker/PartySizePicker";
import "./JoinForm.scss";

// The live quote for the size picked, straight from the server's estimate.
function EstimateBanner({ estimate }: EstimateBannerProps) {
  const { t } = useTranslation();
  if (!estimate) return null;
  if (estimate.queueState !== "open") {
    return <p className="join-form__estimate join-form__estimate--closed">{t(`wait.${estimate.queueState}`)}</p>;
  }
  const minutes = estimate.estimatedWaitMinutes;
  return (
    <p className="join-form__estimate" aria-live="polite">
      <strong className="tabular">{minutes === 0 ? t("wait.none") : t("wait.about", { minutes })}</strong>
      <span>{t("restaurant.partiesAhead", { count: estimate.partiesAhead })}</span>
    </p>
  );
}

function JoinForm({ restaurant, estimate, form, failed, submitting, onSubmit, onUpdate }: JoinFormProps) {
  const { t } = useTranslation();
  const closed = restaurant ? !restaurant.queueEnabled : false;

  return (
    <form className="join-form" onSubmit={(event) => void onSubmit(event)}>
      <PartySizePicker value={form.partySize} onChange={(partySize) => onUpdate({ partySize })} />
      <label className="join-form__field">
        {t("queue.name")}
        <input value={form.guestName} onChange={(e) => onUpdate({ guestName: e.target.value })} autoComplete="given-name" placeholder={t("queue.namePlaceholder")} required />
      </label>
      <label className="join-form__field">
        {t("queue.phoneLabel")}
        <input value={form.phone} onChange={(e) => onUpdate({ phone: e.target.value })} type="tel" inputMode="tel" autoComplete="tel" placeholder="+45" />
      </label>
      <EstimateBanner estimate={estimate} />
      {failed && <p className="join-form__error" role="alert">{t("queue.joinFailed")}</p>}
      <button className="join-form__submit" type="submit" disabled={submitting || closed}>
        {submitting ? t("queue.joining") : t("queue.joinSubmit", { count: form.partySize })}
      </button>
    </form>
  );
}

export default JoinForm;
