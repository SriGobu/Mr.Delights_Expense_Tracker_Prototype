import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { ExpenseProvider } from "./context/ExpenseContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <ExpenseProvider>
          <App />
        </ExpenseProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
