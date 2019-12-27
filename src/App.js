import React from "react";
import { BrowserRouter } from "react-router-dom";

import Router from "./Router";
import { AuthProvider } from "./auth";
import { ElectronProvider } from "./electron";

import { NotificationsProvider } from "./notifications";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <ElectronProvider>
        <NotificationsProvider>
          <AuthProvider>
            <Router />
          </AuthProvider>
        </NotificationsProvider>
      </ElectronProvider>
    </BrowserRouter>
  );
}
