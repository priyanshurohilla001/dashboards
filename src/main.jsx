import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <ThemeProvider>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </ThemeProvider>
  // </StrictMode>,
);
