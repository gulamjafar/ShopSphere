import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import "./App.css";

const isAdmin = window.location.pathname === "/admin";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {isAdmin ? <AdminDashboard /> : <App />}
  </React.StrictMode>
);