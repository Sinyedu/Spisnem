import "./Wordmark.scss";

// Text placeholder for the brand logo. When the animated SVG logo is ready,
// swap the contents of this component only — call sites stay unchanged.
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`wordmark ${className}`} aria-label="Spisnem">
      SPISNEM
    </span>
  );
}
