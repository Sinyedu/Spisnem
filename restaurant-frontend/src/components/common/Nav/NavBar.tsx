import { ArrowLeft, Heart, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./NavBar.scss";

function NavBar() {
  const navigate = useNavigate();

  return (
    <nav className="hero-nav" aria-label="Restaurant navigation">
      <button
        className="hero-nav__button"
        aria-label="Go back"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
      </button>

      <div className="hero-nav__actions">
        <button className="hero-nav__button" aria-label="Add to favorites">
          <Heart size={20} />
        </button>

        <button className="hero-nav__button" aria-label="Share restaurant">
          <Share2 size={20} />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;