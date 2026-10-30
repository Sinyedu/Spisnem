import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./i18n";
import "./styles/main.scss";
import { BrowserRouter } from "react-router-dom";

// Routes live in App.tsx — main.tsx only mounts the app inside the router.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
