import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSummary } from "../../lib/summary";
import "./Welcome.scss";

export default function Welcome() {
  const navigate = useNavigate();
  const [openNow, setOpenNow] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    // The badge is decorative — if the API is unavailable we simply omit the count.
    getSummary()
      .then((s) => active && setOpenNow(s.openNow))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="welcome">
      <section className="welcome__hero">
        <div className="welcome__badge">
          <span className="welcome__ring welcome__ring--1" />
          <span className="welcome__ring welcome__ring--2" />
          <span className="welcome__mark" aria-hidden>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 3v7M5 3v4a2 2 0 0 0 4 0V3M7 10v11" />
              <path d="M17 3c-1.7 0-3 2-3 4.5S15.3 12 17 12v9" />
            </svg>
          </span>
          <span className="welcome__pill welcome__pill--open">
            <span className="welcome__dot" /> {openNow ?? "•"} open
          </span>
          <span className="welcome__pill welcome__pill--rating">★ Top rated</span>
        </div>

        {/* Placeholder for the animated logo — swap this wordmark for the SVG later. */}
        <h1 className="welcome__wordmark">SPISNEM</h1>
        <p className="welcome__tagline">Order at the table, skip the queue, enjoy the food.</p>
      </section>

      <section className="welcome__actions">
        <button className="btn btn--primary" onClick={() => navigate("/signup")}>
          Create an account
        </button>
        <button className="btn btn--secondary" onClick={() => navigate("/signin")}>
          Sign in
        </button>
        <button className="btn btn--ghost" onClick={() => navigate("/discover")}>
          Continue as guest
        </button>

        <div className="welcome__dots" aria-hidden>
          <span className="welcome__page welcome__page--active" />
          <span className="welcome__page" />
          <span className="welcome__page" />
          <span className="welcome__page" />
        </div>
      </section>
    </main>
  );
}
