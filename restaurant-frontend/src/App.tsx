import { Navigate, Route, Routes } from "react-router-dom";
import "./App.scss";
import QueueTracker from "./components/queue/QueueTracker/QueueTracker";
import { IS_PRODUCTION } from "./config/env";
import { previewEnabled } from "./lib/preview";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ComingSoon from "./pages/ComingSoon/ComingSoon";
import { default as Map, default as MapPage } from "./pages/Map/Map";
import Menu from "./pages/Menu/Menu";
import Queue from "./pages/Queue/Queue";
import Restaurant from "./pages/Restaurant/Restaurant";
import Welcome from "./pages/Welcome/Welcome";

function ConstructionPage() {
  return (
    <main className="construction">
      <div className="construction__glow construction__glow--top" />
      <div className="construction__glow construction__glow--bottom" />

      <section className="construction__content" aria-labelledby="page-title">
        <div className="construction__mark">
          <span aria-hidden="true" />
          <img src="/images/logo2.png" alt="SpisNem" />
        </div>

        <p className="construction__eyebrow">
          <span aria-hidden="true" />
          Something good is cooking
        </p>

        <h1 id="page-title">Under construction</h1>
        <p className="construction__description">
          We&rsquo;re putting the finishing touches on a better way to find your
          next meal. Check back soon.
        </p>
      </section>

      <footer className="construction__footer">
        <span>&copy; {new Date().getFullYear()} SpisNem</span>
        <span className="construction__status">
          <span aria-hidden="true" />
          Work in progress
        </span>
      </footer>
    </main>
  );
}
function App() {
  if (IS_PRODUCTION && !previewEnabled) {
    return <ConstructionPage />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/map" element={<Map />} />
        <Route path="menu/:slug" element={<Menu />} />

        {/* Any unfinished or unknown route */}
        <Route path="*" element={<ComingSoon />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/restaurants/:slug" element={<Restaurant />} />
        <Route path="/restaurants/:slug/queue" element={<Queue />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/queue" element={<Queue />} />
        <Route path="/favourites" element={<ComingSoon />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <QueueTracker />
    </>
  );
}

export default App;
