import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import Welcome from "./pages/Welcome/Welcome";
import Signup from "./pages/Signup/Signup";
import Signin from "./pages/Signin/Signin";
import Discover from "./pages/Discover/Discover";
import Restaurant from "./pages/Restaurant/Restaurant";
import Queue from "./pages/Queue/Queue";
import "./App.scss";

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/r/:slug" element={<Restaurant />} />
          <Route path="/queue/:token" element={<Queue />} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

export default App;
