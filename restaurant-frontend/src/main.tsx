import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";

// Self-hosted fonts (no CDN).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource-variable/cormorant";

// Leaflet base styles (map tiles/controls).
import "leaflet/dist/leaflet.css";

import App from "./App.tsx";
import { queryClient } from "./lib/queryClient.ts";
import "./styles/main.scss";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
