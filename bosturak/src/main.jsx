import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./app/App.jsx";

import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import { ParkingsProvider } from "./context/ParkingsContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <ParkingsProvider>
        <App />
      </ParkingsProvider>
    </ThemeProvider>
  </StrictMode>
);