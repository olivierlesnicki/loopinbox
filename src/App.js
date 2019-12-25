import React from "react";
import { BrowserRouter } from "react-router-dom";

import Router from "./Router";
import { AuthProvider } from "./auth";
import { NotificationsProvider } from "./notifications";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <NotificationsProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </NotificationsProvider>
    </BrowserRouter>
  );
}
