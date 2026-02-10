import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRoutes from "./AppRoutes";
import { BrowserRouter as Router } from "react-router-dom";
import "./global.css";
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate";
import { ToastProvider } from "@/components/ToastProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Auth0ProviderWithNavigate>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </Auth0ProviderWithNavigate>
    </Router>
  </StrictMode>
);
