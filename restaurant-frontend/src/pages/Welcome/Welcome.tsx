import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import Wordmark from "../../components/Wordmark";
import { CutleryIcon, StarIcon } from "../../components/icons";
import "./Welcome.scss";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome">
      <div className="welcome__hero">
        <div className="welcome__badge">
          <span className="welcome__ring welcome__ring--1" />
          <span className="welcome__ring welcome__ring--2" />
          <span className="welcome__mark">
            <CutleryIcon size={34} />
          </span>
          {/*
            Decorative only — these floating badges are part of the hero art and
            are NOT backed by live data. Wire them to a real "open now" / average
            rating aggregate before presenting them as real figures.
          */}
          <span className="welcome__pill welcome__pill--open" aria-hidden>
            <span className="welcome__dot" /> Open nearby
          </span>
          <span className="welcome__pill welcome__pill--rating" aria-hidden>
            <StarIcon size={13} /> Top rated
          </span>
        </div>

        <Wordmark className="welcome__wordmark" />
        <p className="welcome__tagline">Order at the table, skip the queue, enjoy the food.</p>
      </div>

      <div className="welcome__actions">
        <Button full onClick={() => navigate("/signup")}>
          Create an account
        </Button>
        <Button full variant="secondary" onClick={() => navigate("/signin")}>
          Sign in
        </Button>
        <Button full variant="ghost" onClick={() => navigate("/discover")}>
          Continue as guest
        </Button>

        <div className="welcome__dots">
          <span className="welcome__page welcome__page--active" />
          <span className="welcome__page" />
          <span className="welcome__page" />
          <span className="welcome__page" />
        </div>
      </div>
    </div>
  );
}
