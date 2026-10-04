import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PartySizePickerProps } from "../../../types/queue";
import "./PartySizePicker.scss";

// One tap covers most parties; bigger groups use the stepper that follows.
const QUICK_SIZES = [1, 2, 3, 4, 5, 6];
// Matches the backend's accepted range for a queue entry.
export const MAX_PARTY_SIZE = 20;
const ICON_SIZE = 18;

function PartySizePicker({ value, onChange }: PartySizePickerProps) {
  const { t } = useTranslation();

  return (
    <fieldset className="party-size">
      <legend className="party-size__legend">{t("queue.partySizeLabel")}</legend>
      <div className="party-size__quick">
        {QUICK_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            aria-pressed={size === value}
            className={`party-size__option ${size === value ? "party-size__option--active" : ""}`}
            onClick={() => onChange(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <div className="party-size__stepper">
        <span>{t("queue.biggerParty")}</span>
        <button type="button" aria-label={t("queue.fewer")} disabled={value <= 1} onClick={() => onChange(value - 1)}>
          <Minus size={ICON_SIZE} aria-hidden />
        </button>
        <output className="tabular" aria-live="polite">{value}</output>
        <button type="button" aria-label={t("queue.more")} disabled={value >= MAX_PARTY_SIZE} onClick={() => onChange(value + 1)}>
          <Plus size={ICON_SIZE} aria-hidden />
        </button>
      </div>
    </fieldset>
  );
}

export default PartySizePicker;
