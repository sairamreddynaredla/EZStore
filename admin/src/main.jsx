import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import { ToastProvider } from "./context/toast-context";
import Toast from "./components/common/Toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ToastProvider>
        <App />
        <Toast />
      </ToastProvider>
    </HelmetProvider>
  </StrictMode>
);
