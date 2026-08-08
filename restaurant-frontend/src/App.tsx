import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import "./App.scss";

// Temporary target for screens that arrive in later PRs (sign in, sign up, discover).
function ComingSoon() {
  return (
    <main className="coming-soon">
      <p>This screen is coming soon.</p>
      <Link to="/">← Back</Link>
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />

        {/* Any unfinished or unknown route */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
