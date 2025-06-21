import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import "./main.css";
import { routes } from "./routes/routes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={createHashRouter(routes)} />
  </StrictMode>,
);
