import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = document.getElementById("root")!;
root.style.margin = "0";
document.body.style.margin = "0";

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
