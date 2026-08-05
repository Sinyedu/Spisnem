import "./Spinner.scss";

export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner__ring" />
      {label && <span className="spinner__label">{label}</span>}
    </div>
  );
}
