import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { WishlistProvider } from "./context/WishListContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <WishlistProvider>
          <App />
        </WishlistProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>
);
