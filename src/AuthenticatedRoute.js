import React from "react";
import { Route, Redirect } from "react-router-dom";

import { useAuth } from "./auth";

export default function AuthenticatedRoute({ children, ...props }) {
  const auth = useAuth();

  return (
    <Route
      {...props}
      render={({ location }) =>
        !!auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}
