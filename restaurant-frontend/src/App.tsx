import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome/Welcome";
import Home from "./pages/Home/Home";
import "./App.scss";

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
        <Route path="/home" element={<Home />} />

        {/* Any unfinished or unknown route */}
        <Route path="*" element={<ComingSoon />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;